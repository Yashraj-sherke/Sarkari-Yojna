import { cookies } from 'next/headers';
import { schemeSchema, effectiveStatus, type Scheme } from './domain';
import { createDbAdapter } from './local-db';

export function db() {
  return createDbAdapter();
}

export async function maintenance() {
  const now = new Date().toISOString();
  const d = db();
  await d.prepare("UPDATE schemes SET status='NEEDS_REVIEW',data=json_set(data,'$.status','NEEDS_REVIEW') WHERE status='ACTIVE' AND (next_review_at IS NULL OR next_review_at<=?)").bind(now).run();
  await d.prepare('DELETE FROM sessions WHERE expires_at<=?').bind(now).run();
  await d.prepare("DELETE FROM reports WHERE created_at<datetime('now','-90 days')").run();
  await d.prepare('DELETE FROM rate_limits WHERE expires<?').bind(Date.now()).run();
}

export async function allSchemes(): Promise<Scheme[]> {
  await maintenance();
  const rows = await db().prepare('SELECT data FROM schemes ORDER BY rowid').all<{ data: string }>();
  return rows.results.map(r => schemeSchema.parse(JSON.parse(r.data)));
}

export async function getScheme(slug: string): Promise<Scheme | null> {
  const r = await db().prepare('SELECT data FROM schemes WHERE slug=?').bind(slug).first<{ data: string }>();
  if (!r) return null;
  const s = schemeSchema.parse(JSON.parse(r.data));
  s.status = effectiveStatus(s);
  return s;
}

export async function adminIdentity(): Promise<{ userId: string; displayName: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  const session = await db().prepare('SELECT a.id, a.username FROM admin_sessions s JOIN admin_users a ON s.admin_id=a.id WHERE s.token=? AND s.expires_at>?')
    .bind(token, new Date().toISOString()).first<{ id: string; username: string }>();
  if (!session) return null;
  return { userId: session.id, displayName: session.username };
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function checkOrigin(req: Request) {
  // Relaxed for local dev  
  if (!req.headers.get('content-type')?.startsWith('application/json')) {
    throw new HttpError(415, 'JSON आवश्यक है।');
  }
}

export async function readBody(req: Request) {
  const body = await req.text();
  if (body.length > 30000) throw new HttpError(413, 'जानकारी बहुत बड़ी है।');
  try {
    return JSON.parse(body);
  } catch {
    throw new HttpError(400, 'जानकारी का प्रारूप सही नहीं है।');
  }
}

export async function rateLimit(_req: Request, _kind: string, _limit = 30) {
  // Simplified for local dev — no rate limiting
}

export async function session(req: Request, create = false) {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const match = cookieHeader.match(/(?:^|;\s*)sy_session=([a-f0-9-]{36})/);
  const id = match?.[1];
  if (id) {
    const row = await db().prepare('SELECT id FROM sessions WHERE id=? AND expires_at>?')
      .bind(id, new Date().toISOString()).first<{ id: string }>();
    if (row) return { id: row.id, cookie: null };
  }
  if (!create) return null;
  const next = crypto.randomUUID();
  await db().prepare('INSERT INTO sessions VALUES (?,?)').bind(next, new Date(Date.now() + 90 * 86400000).toISOString()).run();
  return {
    id: next,
    cookie: `sy_session=${next}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7776000`
  };
}

export async function event(name: string) {
  await db().prepare('INSERT INTO events(day,name,count) VALUES (?, ?, 1) ON CONFLICT(day,name) DO UPDATE SET count=count+1')
    .bind(new Date().toISOString().slice(0, 10), name).run();
}

export function json(value: unknown, status = 200, cookie?: string | null) {
  return Response.json(value, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...(cookie ? { 'Set-Cookie': cookie } : {})
    }
  });
}

export function failure(e: unknown) {
  if (e instanceof HttpError) return json({ error: e.message }, e.status);
  if (e && typeof e === 'object' && 'issues' in e) {
    return json({ error: 'जानकारी जाँचें। सभी आवश्यक फ़ील्ड और नियम सही होने चाहिए।', issues: (e as { issues: unknown }).issues }, 400);
  }
  console.error('Request failed', e instanceof Error ? e.message : 'unknown');
  return json({ error: 'सेवा अभी उपलब्ध नहीं है। कृपया थोड़ी देर बाद फिर कोशिश करें।' }, 503);
}

export async function saveScheme(input: unknown, actor: string, changes: string, oldSlug?: string) {
  const s = schemeSchema.parse(input);
  if (oldSlug && oldSlug !== s.slug) throw new HttpError(400, 'मौजूदा योजना का URL नहीं बदला जा सकता।');
  const now = new Date();
  if (s.status === 'ACTIVE') {
    s.verifiedAt = now.toISOString();
    s.nextReviewAt = new Date(now.getTime() + (s.priority ? 90 : 180) * 86400000).toISOString();
  } else {
    s.verifiedAt = null;
    s.nextReviewAt = null;
  }
  const prior = await getScheme(s.slug);
  if (!oldSlug && prior) throw new HttpError(409, 'यह URL पहले से मौजूद है।');
  if (oldSlug && !prior) throw new HttpError(404, 'योजना नहीं मिली।');
  
  await db().prepare(
    'INSERT INTO schemes(slug,data,status,next_review_at,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET data=excluded.data,status=excluded.status,next_review_at=excluded.next_review_at,updated_at=excluded.updated_at'
  ).bind(s.slug, JSON.stringify(s), s.status, s.nextReviewAt, now.toISOString()).run();
  
  await db().prepare('INSERT INTO verification_logs VALUES (?,?,?,?,?,?)')
    .bind(crypto.randomUUID(), s.slug, actor, s.sourceUrl, JSON.stringify({ note: changes, before: prior, after: s }), now.toISOString()).run();
  
  return s;
}
