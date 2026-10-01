import { db } from '@/lib/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Verification Logs - Admin' };

export default async function SourcesVerificationPage() {
  const sql = db();
  if (!sql) return <div className="text-center py-20 text-slate-500">Database not connected</div>;

  const results = await sql`SELECT * FROM verification_logs ORDER BY created_at DESC LIMIT 100`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Verification Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Audit trail of all scheme edits and verifications</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Date & Time</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Scheme</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Editor</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Source</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((log: any) => {
              let parsed = { note: '' };
              try { parsed = JSON.parse(log.changes); } catch {}
              return (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: '2-digit',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/schemes/edit/${log.slug}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      {log.slug}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{log.actor}</td>
                  <td className="px-5 py-3">
                    {log.source && log.source.length > 5 ? (
                      <a href={log.source} target="_blank" className="text-xs text-slate-500 hover:text-indigo-600 truncate block max-w-[200px]">
                        🔗 {new URL(log.source).hostname}
                      </a>
                    ) : (
                      <span className="text-xs text-orange-400 font-medium">⚠️ No source</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 max-w-xs truncate">
                    {parsed.note || '—'}
                  </td>
                </tr>
              );
            })}
            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  No verification logs found yet. Edit a scheme to generate logs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
