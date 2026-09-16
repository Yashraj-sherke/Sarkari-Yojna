let env: any = {};
if (typeof process !== 'undefined' && process.env) {
  env = { ...process.env };
}
try {
  // @ts-ignore
  const cf = await import(/* webpackIgnore: true */ 'cloudflare:workers');
  if (cf && cf.env) {
    env = { ...env, ...cf.env };
  }
} catch {
  // Cloudflare Workers environment not available (e.g. running on Vercel / Node)
}
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {schemeSchema,effectiveStatus,type Scheme} from './domain';
import {seeds} from './seed';

export function db():D1Database|null {return (env as {DB?:D1Database})?.DB ?? null;}
export async function maintenance(){
  const d = db();
  if(!d) return;
  const now=new Date().toISOString();
  await d.batch([
    d.prepare("UPDATE schemes SET status='NEEDS_REVIEW',data=json_set(data,'$.status','NEEDS_REVIEW') WHERE status='ACTIVE' AND (next_review_at IS NULL OR next_review_at<=?)").bind(now),
    d.prepare('DELETE FROM sessions WHERE expires_at<=?').bind(now),
    d.prepare('DELETE FROM reports WHERE created_at<?').bind(new Date(Date.now()-90*86400000).toISOString()),
    d.prepare('DELETE FROM rate_limits WHERE expires<?').bind(Date.now()),
  ]);
}
export async function allSchemes():Promise<Scheme[]>{
  const d = db();
  if(!d) return seeds;
  try {
    await maintenance();
    const r=await d.prepare('SELECT data FROM schemes ORDER BY rowid').all<{data:string}>();
    return r.results.map(x=>schemeSchema.parse(JSON.parse(x.data)));
  } catch {
    return seeds;
  }
}
export async function getScheme(slug:string):Promise<Scheme|null>{
  const d = db();
  if(!d) {
    const s=seeds.find(x=>x.slug===slug);
    if(!s) return null;
    s.status=effectiveStatus(s);
    return s;
  }
  try {
    const r=await d.prepare('SELECT data FROM schemes WHERE slug=?').bind(slug).first<{data:string}>();
    if(!r) return null;
    const s=schemeSchema.parse(JSON.parse(r.data));
    s.status=effectiveStatus(s);
    return s;
  } catch {
    const s=seeds.find(x=>x.slug===slug);
    if(!s) return null;
    s.status=effectiveStatus(s);
    return s;
  }
}
export async function adminIdentity(){const u=await getChatGPTUser();const allowed=((env as {ADMIN_USER_IDS?:string})?.ADMIN_USER_IDS??'').split(',').map(x=>x.trim()).filter(Boolean);return u&&allowed.includes(u.userId)?u:null;}
export class HttpError extends Error{status:number;constructor(status:number,message:string){super(message);this.status=status;}}
export function checkOrigin(req:Request){if(req.headers.get('origin')!==new URL(req.url).origin)throw new HttpError(403,'अनुरोध का स्रोत मान्य नहीं है।');if(!req.headers.get('content-type')?.startsWith('application/json'))throw new HttpError(415,'JSON आवश्यक है।');}
export async function readBody(req:Request){if(Number(req.headers.get('content-length'))>30000)throw new HttpError(413,'जानकारी बहुत बड़ी है।');const body=await req.text();if(body.length>30000)throw new HttpError(413,'जानकारी बहुत बड़ी है।');try{return JSON.parse(body);}catch{throw new HttpError(400,'जानकारी का प्रारूप सही नहीं है।');}}
export async function rateLimit(req:Request,kind:string,limit=30){
  const d = db();
  if(!d) return;
  const ip=req.headers.get('cf-connecting-ip')??'local';
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${kind}:${ip}:${Math.floor(Date.now()/3600000)}`));
  const key=Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,'0')).join('');
  const r=await d.prepare('INSERT INTO rate_limits(key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,Date.now()+3600000).first<{count:number}>();
  if((r?.count??0)>limit)throw new HttpError(429,'बहुत से अनुरोध आए हैं। एक घंटे बाद फिर कोशिश करें।');
}
export async function session(req:Request,create=false){
  const d = db();
  if(!d) return null;
  const id=req.headers.get('cookie')?.match(/(?:^|;\s*)sy_session=([a-f0-9-]{36})/)?.[1];
  if(id){
    const r=await d.prepare('SELECT id FROM sessions WHERE id=? AND expires_at>?').bind(id,new Date().toISOString()).first<{id:string}>();
    if(r)return{id:r.id,cookie:null};
  }
  if(!create)return null;
  const next=crypto.randomUUID();
  await d.prepare('INSERT INTO sessions VALUES (?,?)').bind(next,new Date(Date.now()+90*86400000).toISOString()).run();
  return{id:next,cookie:`sy_session=${next}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7776000${new URL(req.url).protocol==='https:'?'; Secure':''}`};
}
export async function event(name:string){
  const d = db();
  if(!d) return;
  try {
    await d.prepare('INSERT INTO events(day,name,count) VALUES (?,?,1) ON CONFLICT(day,name) DO UPDATE SET count=count+1').bind(new Date().toISOString().slice(0,10),name).run();
  } catch {}
}
export function json(value:unknown,status=200,cookie?:string|null){return Response.json(value,{status,headers:{'Cache-Control':'no-store',...(cookie?{'Set-Cookie':cookie}:{})}});}
export function failure(e:unknown){if(e instanceof HttpError)return json({error:e.message},e.status);if(e&&typeof e==='object'&&'issues'in e)return json({error:'जानकारी जाँचें। सभी आवश्यक फ़ील्ड और नियम सही होने चाहिए।',issues:(e as {issues:unknown}).issues},400);console.error('Request failed',e instanceof Error?e.name:'unknown');return json({error:'सेवा अभी उपलब्ध नहीं है। कृपया थोड़ी देर बाद फिर कोशिश करें।'},503);}
export async function saveScheme(input:unknown,actor:string,changes:string,oldSlug?:string){
  const d = db();
  if(!d) throw new HttpError(503,'Database not configured');
  const s=schemeSchema.parse(input);
  if(oldSlug&&oldSlug!==s.slug)throw new HttpError(400,'मौजूदा योजना का URL नहीं बदला जा सकता।');
  const now=new Date();
  if(s.status==='ACTIVE'){s.verifiedAt=now.toISOString();s.nextReviewAt=new Date(now.getTime()+(s.priority?90:180)*86400000).toISOString();}
  const prior=await getScheme(s.slug);
  if(!oldSlug&&prior)throw new HttpError(409,'यह URL पहले से मौजूद है।');
  if(oldSlug&&!prior)throw new HttpError(404,'योजना नहीं मिली।');
  await d.batch([
    d.prepare('INSERT INTO schemes(slug,data,status,next_review_at,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET data=excluded.data,status=excluded.status,next_review_at=excluded.next_review_at,updated_at=excluded.updated_at').bind(s.slug,JSON.stringify(s),s.status,s.nextReviewAt,now.toISOString()),
    d.prepare('INSERT INTO verification_logs VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),s.slug,actor,s.sourceUrl,JSON.stringify({note:changes,before:prior,after:s}),now.toISOString()),
  ]);
  return s;
}
