import { cookies } from 'next/headers';
import { db } from '@/lib/server';

export async function hashPassword(password: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function loginAdmin(email: string, password: string) {
  const sql = db();
  if (!sql) return { error: 'Database not configured' };

  const hash = await hashPassword(password);
  
  const results = await sql`SELECT * FROM users WHERE email=${email}`;
  const user = results[0];

  if (!user || user.password_hash !== hash) {
    return { error: 'Invalid credentials' };
  }

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

  await sql`
    INSERT INTO admin_sessions (id, user_id, expires_at)
    VALUES (${sessionId}, ${user.id}, ${expiresAt})
  `;

  const cookieStore = await cookies();
  cookieStore.set('admin_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  return { success: true };
}

export async function getAdminUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('admin_session')?.value;
  
  if (!sessionId) return null;

  const sql = db();
  if (!sql) return null;

  const sessionResults = await sql`SELECT * FROM admin_sessions WHERE id=${sessionId}`;
  const session = sessionResults[0];

  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }

  const userResults = await sql`SELECT * FROM users WHERE id=${session.user_id}`;
  return userResults[0] || null;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('admin_session')?.value;
  
  if (sessionId) {
    const sql = db();
    if (sql) {
      await sql`DELETE FROM admin_sessions WHERE id=${sessionId}`;
    }
    cookieStore.delete('admin_session');
  }
}
