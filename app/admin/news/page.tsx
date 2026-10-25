import GenerateDraftButton from '@/components/admin/GenerateDraftButton';
import Link from 'next/link';
import { database } from '@/lib/admin-cms';
import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import { permitted } from '@/lib/admin-policy';
export const dynamic='force-dynamic';
export default async function Page(){const user=await requirePermission();const sql=database();const rows=await sql`SELECT s.slug,COALESCE(d.data::jsonb->>'title',s.title) AS title,COALESCE(d.workflow,'LEGACY') AS workflow FROM samachar s LEFT JOIN cms_news_drafts d ON s.slug=d.slug UNION ALL SELECT slug,data::jsonb->>'title',workflow FROM cms_news_drafts d WHERE NOT EXISTS(SELECT 1 FROM samachar s WHERE s.slug=d.slug) ORDER BY slug LIMIT 100`;return <section><h1 className="text-2xl font-bold">समाचार और अपडेट</h1>{permitted(user.role,'edit')&&<GenerateDraftButton/>}{permitted(user.role,'edit')&&<Link className="btn my-4" href="/admin/news/edit/new">नया समाचार draft</Link>}{rows.map(row=><Link key={row.slug} href={`/admin/news/edit/${row.slug}`} className="block bg-white border rounded p-4 mb-3">{row.title} · {row.workflow}</Link>)}</section>;}


