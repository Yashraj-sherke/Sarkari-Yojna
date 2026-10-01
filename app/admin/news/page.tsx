import { db } from '@/lib/server';
import Link from 'next/link';
import GenerateDraftButton from '@/components/admin/GenerateDraftButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'News & Updates - Admin' };

export default async function AdminNewsPage() {
  const sql = db();
  if (!sql) return <div className="text-center py-20 text-slate-500">Database disconnected</div>;

  const results = await sql`SELECT slug, title, status, category, image_url, updated_at FROM samachar ORDER BY updated_at DESC`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">News & Updates</h1>
          <p className="text-sm text-slate-500 mt-1">{results.length} articles total</p>
        </div>
        <div className="flex items-center gap-3">
          <GenerateDraftButton />
          <Link href="/admin/news/edit/new" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
            ➕ Create Article
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Last Updated</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((article: any) => (
              <tr key={article.slug} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-800 text-sm">{article.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{article.slug}</div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm text-slate-600">{article.category}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                    article.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-slate-500">
                  {new Date(article.updated_at).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/news/edit/${article.slug}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mr-3">
                    Edit
                  </Link>
                  <a href={`/samachar/${article.slug}`} target="_blank" className="text-slate-500 hover:text-slate-700 text-sm">
                    View
                  </a>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  No news articles found. Click &quot;Create Article&quot; to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
