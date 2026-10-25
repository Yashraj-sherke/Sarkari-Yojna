import { database } from '@/lib/admin-cms';
import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import Link from 'next/link';
export const dynamic='force-dynamic';
async function loadDashboard(){
 try {
    const sql=database();
    const [counts,recent,activity]=await Promise.all([
      sql`SELECT workflow,count(*)::int AS count FROM cms_drafts GROUP BY workflow`,
      sql`SELECT slug,data,workflow,updated_at FROM cms_drafts ORDER BY updated_at DESC LIMIT 8`,
      sql`SELECT actor,action,slug,created_at FROM cms_history ORDER BY created_at DESC LIMIT 8`,
    ]);
    const publicCount=await sql`SELECT count(*)::int AS count FROM schemes WHERE status IN ('ACTIVE','NEEDS_REVIEW','UPDATE_REQUIRED','CLOSED','ARCHIVED') AND data::jsonb->>'isSample'='false'`;
    const totals=await sql`WITH records AS (SELECT s.slug,COALESCE(d.data,s.data)::jsonb AS data FROM schemes s LEFT JOIN cms_drafts d ON d.slug=s.slug UNION ALL SELECT slug,data::jsonb FROM cms_drafts d WHERE NOT EXISTS(SELECT 1 FROM schemes s WHERE s.slug=d.slug)) SELECT count(*)::int AS total,count(*) FILTER(WHERE COALESCE(data->'editorial'->>'verificationStatus','NEEDS_VERIFICATION')<>'VERIFIED_CORE')::int AS unverified,count(*) FILTER(WHERE data->>'status' IN ('CLOSED','ARCHIVED'))::int AS inactive FROM records`;
 return {counts,recent,activity,publicCount,totals};
 } catch { return null; }
}
export default async function Dashboard(){
 await requirePermission();
 const data=await loadDashboard();
 if(!data)return <section role="alert"><h1 className="text-xl font-bold">प्रशासन setup आवश्यक है</h1><p>Database और admin migration configure करें। कोई demo statistics नहीं दिखाए जा रहे हैं।</p></section>;
 const {counts,recent,activity,publicCount,totals}=data;
return <div className="space-y-6"><h1 className="text-2xl font-bold">संपादकीय डैशबोर्ड</h1><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4"><Link href="/admin/schemes" className="border rounded-xl bg-white p-5">कुल योजनाएँ: {totals[0].total}</Link><Link href="/admin/schemes?verification=NEEDS_VERIFICATION" className="border rounded-xl bg-white p-5">सत्यापन लंबित: {totals[0].unverified}</Link><Link href="/admin/schemes?status=CLOSED" className="border rounded-xl bg-white p-5">बंद / संग्रहित: {totals[0].inactive}</Link><Link href="/admin/schemes" className="border rounded-xl bg-white p-5">सार्वजनिक रिकॉर्ड: {publicCount[0].count}</Link>{counts.map(row=><Link className="border rounded-xl bg-white p-5" href={`/admin/schemes?workflow=${row.workflow}`} key={row.workflow}>{row.workflow}: {row.count}</Link>)}</div><p>Working drafts के आँकड़े वास्तविक database से हैं। पुराने सार्वजनिक लेख draft खोलने पर इस workflow में आएँगे।</p><section className="border rounded-xl bg-white p-5"><h2 className="font-bold">हाल में बदले गए drafts</h2>{recent.map(row=><Link key={row.slug} href={`/admin/schemes/edit/${row.slug}`} className="block border-b py-3">{JSON.parse(row.data).title} · {row.workflow} · {row.updated_at}</Link>)}</section><section className="border rounded-xl bg-white p-5"><h2 className="font-bold">हाल की गतिविधि</h2>{activity.map((row,i)=><p key={i}>{row.action} · {row.slug} · {row.actor} · {row.created_at}</p>)}</section></div>;
}


