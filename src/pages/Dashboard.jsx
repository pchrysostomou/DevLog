import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLogs } from '../hooks/useLogs'
import { useStreak } from '../hooks/useStreak'
import { useNavigate, Link } from 'react-router-dom'
import CalendarView from '../components/logs/CalendarView'
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap'
import StudyHoursChart from '../components/dashboard/StudyHoursChart'
import TagsPieChart from '../components/dashboard/TagsPieChart'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { logs, fetchLogs, loading } = useLogs(user?.id)
  const streak = useStreak(logs)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchLogs()
    }
  }, [user, fetchLogs])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // Calculate simple stats
  const totalHours = logs.reduce((acc, log) => acc + Number(log.hours || 0), 0)
  const totalLogs = logs.length

  return (
    <div className="p-4 md:p-8 pb-12 w-full max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] md:w-[300px] h-1 bg-indigo-500/50 blur-[2px]"></div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">Dashboard Overview</h1>
            <p className="text-slate-400 mt-2 font-medium">
              Welcome back, {user?.email}
            </p>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl group flex flex-col justify-center items-center relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
            <h3 className="text-slate-400 font-semibold mb-2 uppercase tracking-widest text-xs">Total Logs</h3>
            <p className="text-6xl font-black text-white tracking-tight drop-shadow-sm">{loading ? '...' : totalLogs}</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl group flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
            <h3 className="text-slate-400 font-semibold mb-2 uppercase tracking-widest text-xs">Total Study Hours</h3>
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 tracking-tight">{loading ? '...' : totalHours}<span className="text-2xl text-slate-500 ml-1 font-bold">hrs</span></p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl group flex flex-col justify-center items-center relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
            <h3 className="text-slate-400 font-semibold mb-2 uppercase tracking-widest text-xs">Current Streak</h3>
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 tracking-tight">{loading ? '...' : streak}<span className="text-2xl text-slate-500 ml-1 font-bold">d</span></p>
          </div>
        </div>

        {/* Activity Heatmap Row */}
        <div className="w-full">
          <ActivityHeatmap logs={logs} />
        </div>

        {/* Charts & Calendar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CalendarView logs={logs} />
          <StudyHoursChart logs={logs} />
          <TagsPieChart logs={logs} />
        </div>

      </div>
  )
}
