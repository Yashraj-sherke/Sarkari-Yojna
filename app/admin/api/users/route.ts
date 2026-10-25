import { z } from 'zod';
import { database } from '@/lib/admin-cms';
import { requirePermission } from '@/lib/admin-auth';
import { roles } from '@/lib/admin-policy';
import { hashPassword } from '@/lib/admin-password';
import { adminRateLimit } from '@/lib/admin-rate-limit';
import { checkOrigin, readBody, json, failure, HttpError } from '@/lib/server';
export async function GET(req:Request){try{await requirePermission('users');const sql=database();const url=new URL(req.url);const q=(url.searchParams.get('q')??'').slice(0,100);const page=Math.max(1,Math.min(10000,Number(url.searchParams.get('page'))||1));return json({users:await sql`SELECT id,email,role,active,created_at FROM users WHERE email ILIKE ${'%'+q+'%'} ORDER BY email LIMIT 25 OFFSET ${(page-1)*25}`});}catch(error){return failure(error);}}
export async function POST(req:Request){try{
 checkOrigin(req);const actor=await requirePermission('users');const sql=database();
 await adminRateLimit(actor.id,'users',30);
 const body=z.object({id:z.string().max(200).optional(),email:z.string().email().max(200),role:z.enum(roles),active:z.boolean(),password:z.string().min(12).max(200).optional()}).strict().parse(await readBody(req));
 if(body.id===actor.id)throw new HttpError(403,'अपने account का role / सक्रियता इस पेज से नहीं बदल सकते।');
 if(!body.id&&!body.password)throw new HttpError(400,'नए user के लिए पासवर्ड आवश्यक है।');
 const id=body.id??crypto.randomUUID();const password=body.password?await hashPassword(body.password):null;const now=new Date().toISOString();
 const results=await sql.transaction([
   sql`SELECT pg_advisory_xact_lock(73128921)`,
   sql`WITH changed AS (
   INSERT INTO users(id,email,password_hash,role,active,created_at)
   SELECT ${id},${body.email.toLowerCase()},${password??''},${body.role},${body.active},${now} WHERE ${!body.id}
   ON CONFLICT(id) DO NOTHING RETURNING id
   ), edited AS (
   UPDATE users SET email=${body.email.toLowerCase()},role=${body.role},active=${body.active},password_hash=COALESCE(${password},password_hash)
   WHERE id=${id} AND ${!!body.id} AND (role<>'SUPER_ADMIN' OR active=false OR (${body.role}='SUPER_ADMIN' AND ${body.active}) OR (SELECT count(*) FROM users WHERE role='SUPER_ADMIN' AND active=true)>1) RETURNING id
   ), target AS (SELECT id FROM changed UNION ALL SELECT id FROM edited), logged AS (
   INSERT INTO audit_logs(id,user_id,action,target_id,changes,created_at)
   SELECT ${crypto.randomUUID()},${actor.id},'USER_CHANGED',id,${JSON.stringify({role:body.role,active:body.active,email:body.email,passwordReset:!!password})},${now} FROM target
   ), revoked AS (DELETE FROM admin_sessions WHERE user_id IN(SELECT id FROM target)) SELECT id FROM target`,
 ]);
 if(!results[1].length)throw new HttpError(409,'User नहीं मिला या अंतिम सक्रिय Super Admin को बदलना संभव नहीं है।');return json({success:true});
 }catch(error){return failure(error);}}
