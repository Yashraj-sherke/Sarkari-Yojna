import {getScheme,event} from '@/lib/server';
import {officialUrl} from '@/lib/domain';
export async function GET(req:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=await getScheme(slug);const kind=new URL(req.url).searchParams.get('kind');const url=kind==='source'?s?.sourceUrl:s?.applicationUrl;if(!url||!officialUrl(url)||(kind!=='source'&&s&&['ARCHIVED','CLOSED'].includes(s.status)))return new Response('Official link unavailable',{status:404});await event('official_link_clicked');return Response.redirect(url,302);}
