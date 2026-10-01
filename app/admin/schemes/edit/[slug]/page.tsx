import { db } from '@/lib/server';
import { SchemeEditor } from '@/components/admin/SchemeEditor';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditSchemePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const sql = db();
  if (!sql) return <div>Database not connected</div>;

  const results = await sql`SELECT data FROM schemes WHERE slug=${params.slug}`;
  if (results.length === 0) return notFound();

  const data = JSON.parse(results[0].data);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Scheme: {data.title}</h1>
      <SchemeEditor initialData={data} slug={params.slug} />
    </div>
  );
}
