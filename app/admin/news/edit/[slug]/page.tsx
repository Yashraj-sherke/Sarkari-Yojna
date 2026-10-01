import { db } from '@/lib/server';
import SamacharEditor from '@/components/admin/SamacharEditor';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit News - Admin' };

export default async function EditNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sql = db();
  if (!sql) return <div>Database disconnected</div>;

  let article = null;
  if (slug !== 'new') {
    const results = await sql`SELECT * FROM samachar WHERE slug = ${slug}`;
    if (results.length === 0) {
      notFound();
    }
    article = results[0];
    try {
      article.body = JSON.parse(article.body);
    } catch {
      article.body = [article.body];
    }
  }

  return (
    <div>
      <SamacharEditor initialData={article} />
    </div>
  );
}
