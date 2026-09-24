import { getChatGPTUser } from '@/app/chatgpt-auth';
import { schemeSchema, effectiveStatus, type Scheme } from './domain';
import { seeds } from './seed';
import { enrichSchemeArticle } from './scheme-articles';
import { neon } from '@neondatabase/serverless';

let dbUrl = '';
if (typeof process !== 'undefined' && process.env.DATABASE_URL) {
  dbUrl = process.env.DATABASE_URL;
}

export function db() {
  return dbUrl ? neon(dbUrl) : null;
}

export async function maintenance() {
  const sql = db();
  if (!sql) return;
  const now = new Date().toISOString();
  try {
    // In PostgreSQL, using ::jsonb to update a JSON field in a text column is powerful
    await sql`
      UPDATE schemes 
      SET status='NEEDS_REVIEW', data = (data::jsonb || '{"status":"NEEDS_REVIEW"}'::jsonb)::text 
      WHERE status='ACTIVE' AND (next_review_at IS NULL OR next_review_at<=${now})
    `;
    await sql`DELETE FROM sessions WHERE expires_at<=${now}`;
    await sql`DELETE FROM reports WHERE created_at<${new Date(Date.now() - 90 * 86400000).toISOString()}`;
    await sql`DELETE FROM rate_limits WHERE expires<${Math.floor(Date.now() / 1000)}`;
  } catch (e) {
    console.error('Maintenance error:', e);
  }
}

export async function allSchemes(): Promise<Scheme[]> {
  const sql = db();
  if (!sql) return seeds.map(normalizeScheme);
  try {
    const results = await sql`SELECT data, updated_at FROM schemes ORDER BY slug`;
    return results.map((x) => {
      const s = schemeSchema.parse(JSON.parse(x.data));
      s.lastUpdated = x.updated_at;
      return normalizeScheme(s);
    });
  } catch (e) {
    console.error('allSchemes error', e);
    return seeds.map(normalizeScheme);
  }
}

function normalizeScheme(input: Scheme): Scheme {
  const s = enrichSchemeArticle(input);
  return { ...s, status: effectiveStatus(s) };
}

export async function getScheme(slug: string): Promise<Scheme | null> {
  const sql = db();
  if (!sql) {
    const s = seeds.find(x => x.slug === slug);
    if (!s) return null;
    return normalizeScheme(s);
  }
  try {
    const results = await sql`SELECT data, updated_at FROM schemes WHERE slug=${slug}`;
    if (results.length === 0) return null;
    const r = results[0];
    const s = schemeSchema.parse(JSON.parse(r.data));
    s.lastUpdated = r.updated_at;
    return normalizeScheme(s);
  } catch {
    const s = seeds.find(x => x.slug === slug);
    if (!s) return null;
    return normalizeScheme(s);
  }
}

export async function adminIdentity() {
  const u = await getChatGPTUser();
  const allowed = (process.env.ADMIN_USER_IDS ?? '').split(',').map(x => x.trim()).filter(Boolean);
  return u && allowed.includes(u.userId) ? u : null;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function checkOrigin(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) throw new HttpError(403, 'अनुरोध का स्रोत मान्य नहीं है।');
  if (!req.headers.get('content-type')?.startsWith('application/json')) throw new HttpError(415, 'JSON आवश्यक है।');
}

export async function readBody(req: Request) {
  if (Number(req.headers.get('content-length')) > 30000) throw new HttpError(413, 'जानकारी बहुत बड़ी है।');
  const body = await req.text();
  if (body.length > 30000) throw new HttpError(413, 'जानकारी बहुत बड़ी है।');
  try { return JSON.parse(body); } catch { throw new HttpError(400, 'जानकारी का प्रारूप सही नहीं है।'); }
}

export async function rateLimit(req: Request, kind: string, limit = 30) {
  const sql = db();
  if (!sql) return;
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  
  // Use Web Crypto for hashing in edge
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${kind}:${ip}:${Math.floor(Date.now() / 3600000)}`));
  const key = Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const results = await sql`
    INSERT INTO rate_limits(key, count, expires) 
    VALUES (${key}, 1, ${Math.floor(Date.now() / 1000) + 3600}) 
    ON CONFLICT (key) DO UPDATE SET count = rate_limits.count + 1 
    RETURNING count
  `;
  if ((results[0]?.count ?? 0) > limit) throw new HttpError(429, 'बहुत से अनुरोध आए हैं। एक घंटे बाद फिर कोशिश करें।');
}

export async function session(req: Request, create = false) {
  const sql = db();
  if (!sql) return null;
  const id = req.headers.get('cookie')?.match(/(?:^|;\s*)sy_session=([a-f0-9-]{36})/)?.[1];
  if (id) {
    const results = await sql`SELECT id FROM sessions WHERE id=${id} AND expires_at>${new Date().toISOString()}`;
    if (results.length > 0) return { id: results[0].id, cookie: null };
  }
  if (!create) return null;
  const next = crypto.randomUUID();
  await sql`INSERT INTO sessions (id, expires_at) VALUES (${next}, ${new Date(Date.now() + 90 * 86400000).toISOString()})`;
  return { id: next, cookie: `sy_session=${next}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7776000${new URL(req.url).protocol === 'https:' ? '; Secure' : ''}` };
}

export async function event(name: string) {
  const sql = db();
  if (!sql) return;
  try {
    await sql`
      INSERT INTO events(day, name, count) 
      VALUES (${new Date().toISOString().slice(0, 10)}, ${name}, 1) 
      ON CONFLICT (day, name) DO UPDATE SET count = events.count + 1
    `;
  } catch {}
}

export function json(value: unknown, status = 200, cookie?: string | null) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', ...(cookie ? { 'Set-Cookie': cookie } : {}) } });
}

export function failure(e: unknown) {
  if (e instanceof HttpError) return json({ error: e.message }, e.status);
  if (e && typeof e === 'object' && 'issues' in e) return json({ error: 'जानकारी जाँचें। सभी आवश्यक फ़ील्ड और नियम सही होने चाहिए।', issues: (e as { issues: unknown }).issues }, 400);
  console.error('Request failed', e instanceof Error ? e.message : 'unknown');
  return json({ error: 'सेवा अभी उपलब्ध नहीं है। कृपया थोड़ी देर बाद फिर कोशिश करें।' }, 503);
}

export async function saveScheme(input: unknown, actor: string, changes: string, oldSlug?: string) {
  const sql = db();
  if (!sql) throw new HttpError(503, 'Database not configured');
  const s = schemeSchema.parse(input);
  if (oldSlug && oldSlug !== s.slug) throw new HttpError(400, 'मौजूदा योजना का URL नहीं बदला जा सकता।');
  const now = new Date();
  if (s.status === 'ACTIVE') {
    s.verifiedAt = now.toISOString();
    s.nextReviewAt = new Date(now.getTime() + (s.priority ? 90 : 180) * 86400000).toISOString();
  }
  const prior = await getScheme(s.slug);
  if (!oldSlug && prior) throw new HttpError(409, 'यह URL पहले से मौजूद है।');
  if (oldSlug && !prior) throw new HttpError(404, 'योजना नहीं मिली।');
  
  await sql.transaction((tx) => [
    tx`
      INSERT INTO schemes(slug, data, status, next_review_at, updated_at) 
      VALUES (${s.slug}, ${JSON.stringify(s)}, ${s.status}, ${s.nextReviewAt}, ${now.toISOString()}) 
      ON CONFLICT(slug) DO UPDATE SET data=EXCLUDED.data, status=EXCLUDED.status, next_review_at=EXCLUDED.next_review_at, updated_at=EXCLUDED.updated_at
    `,
    tx`
      INSERT INTO verification_logs (id, slug, actor, source, changes, created_at) 
      VALUES (${crypto.randomUUID()}, ${s.slug}, ${actor}, ${s.sourceUrl}, ${JSON.stringify({ note: changes, before: prior, after: s })}, ${now.toISOString()})
    `
  ]);
  
  return s;
}
