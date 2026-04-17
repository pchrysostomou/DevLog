import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Target, LogOut, Code2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function SidebarLayout() {
  const { pathname } = useLocation()
  const { signOut, user } = useAuth()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Logs', path: '/logs', icon: FileText },
    { name: 'Skills', path: '/skills', icon: Target },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 pb-16 md:pb-0">
      {/* Background aesthetics */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-slate-900/50 backdrop-blur-2xl border-r border-slate-800 relative z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Code2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">DevLog</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path)
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group min-h-[44px]
                  ${isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'}
                `}
              >
                <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto mb-4 border-t border-slate-800">
          <div className="px-4 py-3 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Signed in</p>
            <p className="text-sm font-medium text-slate-300 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-colors border border-transparent min-h-[44px]"
          >
            <LogOut size={20} className="text-slate-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MOBILE TOP HEADER --- */}
      <header className="md:hidden flex items-center justify-between bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 relative z-20">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
            <Code2 size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">DevLog</h1>
        </div>
        <button
          onClick={() => signOut()}
          className="text-slate-400 hover:text-red-400 p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 z-50 flex justify-around items-center px-2 py-3 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[64px] rounded-xl transition-all duration-200
                ${isActive ? 'text-indigo-400' : 'text-slate-400'}
              `}
            >
              <Icon size={22} className={`mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full md:h-screen md:overflow-y-auto overflow-x-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 z-50"></div>
        <Outlet />
      </main>
    </div>
  )
}
