import { database,getDraft } from '@/lib/admin-cms';
import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import { permitted } from '@/lib/admin-policy';
import { RestoreButton } from '@/components/admin/RestoreButton';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}) {
 const user=await requirePermission();const {slug}=await params;const draft=await getDraft(slug);if(!draft)notFound();const sql=database();const rows=await sql`SELECT id,version,actor,action,note,created_at,data FROM cms_history WHERE slug=${slug} ORDER BY created_at DESC LIMIT 50`;
 return <section className="space-y-4"><h1 className="text-2xl font-bold">संस्करण इतिहास: {draft.data.title}</h1>{rows.map(row=><article key={row.id} className="bg-white border rounded p-4"><b>v{row.version} · {row.action}</b><p>{row.actor} · {row.created_at}</p><p>{row.note}</p><details><summary>संस्करण JSON</summary><pre className="overflow-auto">{JSON.stringify(JSON.parse(row.data),null,2)}</pre></details>{permitted(user.role,'edit')&&<RestoreButton id={row.id} slug={slug} version={draft.version}/>}</article>)}{!rows.length&&<p>नए workflow में अभी इतिहास नहीं है। पुराने verification logs स्रोत पेज पर उपलब्ध हैं।</p>}</section>;
}

