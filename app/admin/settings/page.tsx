import { db } from '@/lib/server';
import { getAdminUser } from '@/lib/admin-auth';
import { SettingsClient } from './SettingsClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Settings - Admin' };

export default async function AdminSettingsPage() {
  const user = await getAdminUser();
  const sql = db();

  let userCount = 0;
  let schemeCount = 0;
  let newsCount = 0;
  let logCount = 0;
  if (sql) {
    const [users, schemes, news, logs] = await Promise.all([
      sql`SELECT count(*)::int as c FROM users`,
      sql`SELECT count(*)::int as c FROM schemes`,
      sql`SELECT count(*)::int as c FROM samachar`.catch(() => [{ c: 0 }]),
      sql`SELECT count(*)::int as c FROM verification_logs`,
    ]);
    userCount = users[0]?.c || 0;
    schemeCount = schemes[0]?.c || 0;
    newsCount = news[0]?.c || 0;
    logCount = logs[0]?.c || 0;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">👤 Account Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Email</span>
            <p className="font-medium text-slate-800 mt-0.5">{user?.email}</p>
          </div>
          <div>
            <span className="text-slate-500">Role</span>
            <p className="font-medium text-slate-800 mt-0.5">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">{user?.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <SettingsClient />

      {/* System Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">📊 System Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">{schemeCount}</div>
            <div className="text-xs text-slate-500 mt-1">Total Schemes</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">{newsCount}</div>
            <div className="text-xs text-slate-500 mt-1">News Articles</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">{logCount}</div>
            <div className="text-xs text-slate-500 mt-1">Verification Logs</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">{userCount}</div>
            <div className="text-xs text-slate-500 mt-1">Admin Users</div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-bold text-red-800 mb-2">⚠️ Danger Zone</h2>
        <p className="text-sm text-red-600 mb-4">These actions are irreversible. Use with extreme caution.</p>
        <div className="flex gap-3">
          <button disabled className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
            🗑️ Clear All Verification Logs
          </button>
          <button disabled className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
            🗑️ Delete All News Articles
          </button>
        </div>
        <p className="text-xs text-red-400 mt-2">Contact the developer to enable destructive actions.</p>
      </div>
    </div>
  );
}
