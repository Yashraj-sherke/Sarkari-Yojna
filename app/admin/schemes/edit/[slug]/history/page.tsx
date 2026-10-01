import { db } from '@/lib/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function VersionHistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sql = db();
  if (!sql) return <div>Database not connected</div>;

  const scheme = await sql`SELECT data FROM schemes WHERE slug=${slug}`;
  if (scheme.length === 0) return notFound();
  const data = JSON.parse(scheme[0].data);

  const logs = await sql`
    SELECT id, actor, source, changes, created_at 
    FROM verification_logs 
    WHERE slug=${slug} 
    ORDER BY created_at DESC 
    LIMIT 50
  `;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/schemes/edit/${slug}`} className="text-slate-500 hover:text-slate-700 text-sm">← Back to Editor</Link>
        <h1 className="text-2xl font-bold text-slate-800">Version History: {data.title}</h1>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">No version history found for this scheme.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log: any) => {
            let parsed = { note: '' };
            try { parsed = JSON.parse(log.changes); } catch {}
            return (
              <div key={log.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{parsed.note || 'No note provided'}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>👤 {log.actor}</span>
                      <span>·</span>
                      <span>📅 {new Date(log.created_at).toLocaleString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                  {log.source && log.source.length > 5 && (
                    <a href={log.source} target="_blank" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      🔗 Source
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
