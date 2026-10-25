import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkOrigin, readBody, db, failure, HttpError } from '@/lib/server';
import { roles } from '@/lib/admin-policy';
import { sessionHash, verifyPassword } from '@/lib/admin-password';
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const body = z.object({ email: z.string().email().max(200), password: z.string().min(1).max(200) }).strict().parse(await readBody(req));
    const sql = db(); if (!sql) throw new HttpError(503, 'Database configuration आवश्यक है।');
    const key = `admin-login:${await sessionHash(body.email.toLowerCase())}:${Math.floor(Date.now() / 900000)}`;
    const count = await sql`INSERT INTO rate_limits(key,count,expires) VALUES(${key},1,${Math.floor(Date.now()/1000)+900}) ON CONFLICT(key) DO UPDATE SET count=rate_limits.count+1 RETURNING count`;
    if (count[0].count > 8) throw new HttpError(429, 'कुछ समय बाद दोबारा प्रयास करें।');
    const rows = await sql`SELECT id,email,password_hash,role FROM users WHERE lower(email)=${body.email.toLowerCase()} AND active=true`;
    const user = rows[0];
    const dummy = 'pbkdf2-sha256$600000$00000000000000000000000000000000$0000000000000000000000000000000000000000000000000000000000000000';
    const valid = await verifyPassword(body.password, user?.password_hash || dummy);
    if (!user || !valid || !roles.includes(user.role)) throw new HttpError(401, 'ईमेल या पासवर्ड गलत है।');
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2,'0')).join('');
    const now = new Date().toISOString();
    await sql.transaction([
      sql`INSERT INTO admin_sessions(id,user_id,expires_at) VALUES(${await sessionHash(token)},${user.id},${new Date(Date.now()+8*3600000).toISOString()})`,
      sql`INSERT INTO audit_logs(id,user_id,action,created_at) VALUES(${crypto.randomUUID()},${user.id},'LOGIN',${now})`,
    ]);
    const response = NextResponse.json({ success: true });
    response.cookies.set('setu_admin', token, { httpOnly: true, secure: new URL(req.url).protocol === 'https:', sameSite: 'strict', path: '/', maxAge: 8*3600 });
    response.headers.set('Cache-Control','no-store'); return response;
  } catch (error) { return failure(error); }
}
