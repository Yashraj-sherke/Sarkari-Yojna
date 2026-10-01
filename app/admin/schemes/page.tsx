import { db } from '@/lib/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Manage Schemes - Admin' };

export default async function AdminSchemesPage({ searchParams }: { searchParams: Promise<{ status?: string; category?: string }> }) {
  const params = await searchParams;
  const sql = db();
  if (!sql) return <div className="text-center py-20 text-slate-500">Database not connected</div>;

  const results = await sql`SELECT slug, status, updated_at, data FROM schemes ORDER BY updated_at DESC`;

  // Client-side filter
  const filtered = results.filter((row: any) => {
    const data = JSON.parse(row.data);
    if (params.status && row.status !== params.status) return false;
    if (params.category && data.category !== params.category) return false;
    return true;
  });

  const statusCounts: Record<string, number> = {};
  results.forEach((r: any) => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; });

  const activeFilter = params.status || 'all';
  const filterButtons = [
    { key: 'all', label: 'All', count: results.length },
    { key: 'ACTIVE', label: 'Active', count: statusCounts['ACTIVE'] || 0 },
    { key: 'CLOSED', label: 'Closed', count: statusCounts['CLOSED'] || 0 },
    { key: 'DRAFT', label: 'Draft', count: statusCounts['DRAFT'] || 0 },
    { key: 'NEEDS_REVIEW', label: 'Review', count: statusCounts['NEEDS_REVIEW'] || 0 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Schemes</h1>
          <p className="text-sm text-slate-500 mt-1">{results.length} schemes total · {filtered.length} shown</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/schemes/draft" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-1">
            ✨ AI Draft
          </Link>
          <Link href="/admin/schemes/new" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
            ➕ New Scheme
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filterButtons.map(btn => (
          <Link key={btn.key}
            href={btn.key === 'all' ? '/admin/schemes' : `/admin/schemes?status=${btn.key}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
              activeFilter === btn.key
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {btn.label} ({btn.count})
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Scheme</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Image</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Updated</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((row: any) => {
              const data = JSON.parse(row.data);
              const hasImage = data.imageUrl && data.imageUrl.length > 0;
              return (
                <tr key={row.slug} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-800 text-sm max-w-xs truncate">{data.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{row.slug}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{data.category}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      row.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      row.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
                      row.status === 'NEEDS_REVIEW' ? 'bg-orange-100 text-orange-700' :
                      row.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {hasImage ? (
                      <span className="text-green-600 text-xs">✅</span>
                    ) : (
                      <span className="text-orange-400 text-xs">⚠️ Missing</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {new Date(row.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/schemes/edit/${row.slug}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mr-3">
                      Edit
                    </Link>
                    <a href={`/yojna/${row.slug}`} target="_blank" className="text-slate-500 hover:text-slate-700 text-sm">
                      View
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
