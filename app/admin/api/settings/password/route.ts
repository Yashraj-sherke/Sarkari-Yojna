import { adminRateLimit } from '@/lib/admin-rate-limit';
import { requirePermission } from '@/lib/admin-auth';
import { database } from '@/lib/admin-cms';
import { checkOrigin,readBody,json,failure,HttpError } from '@/lib/server';
import { hashPassword,verifyPassword } from '@/lib/admin-password';
import { z } from 'zod';
export async function POST(req:Request){try{checkOrigin(req);const user=await requirePermission();await adminRateLimit(user.id,'password-change',8);if(!user.local)throw new HttpError(400,'इस account का पासवर्ड identity provider में बदलें।');const body=z.object({currentPassword:z.string().max(200),newPassword:z.string().min(12).max(200)}).strict().parse(await readBody(req));const sql=database();const rows=await sql`SELECT password_hash FROM users WHERE id=${user.id}`;if(!rows.length||!await verifyPassword(body.currentPassword,rows[0].password_hash))throw new HttpError(403,'वर्तमान पासवर्ड गलत है।');const now=new Date().toISOString();await sql.transaction([sql`UPDATE users SET password_hash=${await hashPassword(body.newPassword)} WHERE id=${user.id}`,sql`DELETE FROM admin_sessions WHERE user_id=${user.id}`,sql`INSERT INTO audit_logs(id,user_id,action,created_at) VALUES(${crypto.randomUUID()},${user.id},'PASSWORD_CHANGED',${now})`]);return json({success:true,reauthenticate:true});}catch(error){return failure(error);}}

