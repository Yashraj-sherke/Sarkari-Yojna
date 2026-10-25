import { database } from '@/lib/admin-cms';
import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{page?:string}>}) {
 const user=await requirePermission(); const page=Math.max(1,Number((await searchParams).page)||1);const sql=database();
 const rows=await sql`SELECT actor,action,slug,note,created_at FROM cms_history UNION ALL SELECT user_id,action,COALESCE(target_id,'account'),COALESCE(changes,''),created_at FROM audit_logs WHERE user_id=${user.id} OR ${user.role==='SUPER_ADMIN'} ORDER BY created_at DESC LIMIT 50 OFFSET ${(page-1)*50}`;
 return <section><h1 className="text-2xl font-bold">गतिविधि लॉग</h1>{rows.map((row,i)=><article key={i} className="bg-white border rounded p-4 mt-3"><b>{row.action} · {row.slug}</b><p>{row.actor} · {row.created_at}</p><p>{row.note}</p></article>)}{!rows.length&&<p>कोई रिकॉर्ड नहीं।</p>}<div className="flex gap-5 mt-4">{page>1&&<a href={`?page=${page-1}`}>पिछला</a>}{rows.length===50&&<a href={`?page=${page+1}`}>अगला</a>}</div></section>;
}


