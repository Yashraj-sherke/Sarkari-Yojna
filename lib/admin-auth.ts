import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getChatGPTUser,chatGPTSignOutPath } from '@/app/chatgpt-auth';
import { db, HttpError } from './server';
import { permitted, roles, type AdminRole, type Permission } from './admin-policy';
import { sessionHash } from './admin-password';
export { hashPassword } from './admin-password';
export type AdminUser = { id: string; userId: string; email: string; role: AdminRole; local: boolean };
export async function getAdminUser(): Promise<AdminUser | null> {
  const sql = db();
  const token = (await cookies()).get('setu_admin')?.value;
  if (token && /^[a-f0-9]{64}$/.test(token) && sql) {
    const rows = await sql`SELECT u.id,u.email,u.role FROM admin_sessions s JOIN users u ON u.id=s.user_id WHERE s.id=${await sessionHash(token)} AND s.expires_at>${new Date().toISOString()} AND u.active=true`;
    const user = rows[0];
    if (user && roles.includes(user.role as AdminRole)) return { id: user.id, userId: user.id, email: user.email, role: user.role as AdminRole, local: true };
  }
  // Enable only behind a proxy which strips client-supplied identity headers.
  if (process.env.TRUST_CHATGPT_PROXY !== 'true') return null;
  const identity = await getChatGPTUser();
  if (!identity) return null;
  if (sql) {
    const rows = await sql`SELECT role,active FROM users WHERE id=${identity.userId}`;
    if (rows.length) return rows[0].active && roles.includes(rows[0].role as AdminRole) ? { id: identity.userId, userId: identity.userId, email: identity.email, role: rows[0].role as AdminRole, local: false } : null;
  }
  const allowed = (process.env.ADMIN_USER_IDS ?? '').split(',').map(x => x.trim());
  if(!allowed.includes(identity.userId)||!sql) return null;
  // The operator's explicit trusted-proxy allowlist establishes the initial identity.
  await sql`INSERT INTO users(id,email,password_hash,role,active,created_at) VALUES(${identity.userId},${identity.email.toLowerCase()},'','SUPER_ADMIN',true,${new Date().toISOString()}) ON CONFLICT(id) DO NOTHING`;
  const rows=await sql`SELECT role,active FROM users WHERE id=${identity.userId}`;
  return rows[0]?.active && roles.includes(rows[0].role as AdminRole) ? { id: identity.userId, userId: identity.userId, email: identity.email, role: rows[0].role as AdminRole, local: false } : null;
}
export async function requirePermission(permission?: Permission) {
  const user = await getAdminUser();
  if (!user) throw new HttpError(401, 'व्यवस्थापक प्रवेश आवश्यक है।');
  if (permission && !permitted(user.role, permission)) throw new HttpError(403, 'इस कार्य की अनुमति नहीं है।');
  return user;
}
export async function requireAdminPage(permission?:Permission){
  const user=await getAdminUser();if(!user)redirect('/admin-login');
  if(permission&&!permitted(user.role,permission))redirect('/admin?access=denied');
  return user;
}
export async function logoutAdmin(): Promise<never> {
  const user=await getAdminUser();
  const jar = await cookies(); const token = jar.get('setu_admin')?.value; const sql = db();
  if (token && sql) await sql`DELETE FROM admin_sessions WHERE id=${await sessionHash(token)}`;
  if(user&&sql)await sql`INSERT INTO audit_logs(id,user_id,action,created_at) VALUES(${crypto.randomUUID()},${user.id},'LOGOUT',${new Date().toISOString()})`;
  jar.delete('setu_admin'); redirect(user&&!user.local?chatGPTSignOutPath('/admin-login'):'/admin-login');
}
