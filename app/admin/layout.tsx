import { redirect } from 'next/navigation';
import { getAdminUser, logoutAdmin } from '@/lib/admin-auth';
import Link from 'next/link';

export const metadata = { robots: { index: false, follow: false } };

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
    >
      <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin-login');
  }

  return (
    <div className="flex h-screen" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col" style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold text-white" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            }}>
              S
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">Sarkari Yojana</div>
              <div className="text-slate-400 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Overview</div>
          <NavLink href="/admin" icon="📊" label="Dashboard" />

          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</div>
          <NavLink href="/admin/schemes" icon="📋" label="Schemes" />
          <NavLink href="/admin/news" icon="📰" label="News & Updates" />
          <NavLink href="/admin/schemes/new" icon="➕" label="Create Scheme" />

          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tools</div>
          <NavLink href="/admin/schemes/draft" icon="✨" label="AI Draft Assistant" />
          <NavLink href="/admin/sources" icon="🔍" label="Verification Logs" />
          <NavLink href="/admin/seo" icon="📈" label="SEO Health" />

          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
          <NavLink href="/admin/settings" icon="⚙️" label="Settings" />
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            }}>
              {(user.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user.email}</div>
              <div className="text-xs text-indigo-300">{user.role}</div>
            </div>
          </div>
          <form action={async () => {
            'use server';
            await logoutAdmin();
            redirect('/admin-login');
          }}>
            <button type="submit" className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-2">
              <span>🚪</span> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto" style={{ background: '#f8fafc' }}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
