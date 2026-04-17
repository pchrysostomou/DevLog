import { useMemo } from 'react'
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function StudyHoursChart({ logs }) {
  const data = useMemo(() => {
    const endDate = new Date()
    const startDate = subDays(endDate, 13) // Last 14 days including today
    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate })

    return daysInterval.map(day => {
      // Find all logs for this day
      const dayLogs = logs.filter(log => isSameDay(new Date(log.log_date), day))
      const totalHours = dayLogs.reduce((acc, log) => acc + Number(log.hours || 0), 0)

      return {
        dateName: format(day, 'MMM d'),
        fullDate: format(day, 'yyyy-MM-dd'),
        hours: totalHours
      }
    })
  }, [logs])

  // Custom visual for the tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl">
          <p className="text-slate-300 font-medium text-sm mb-1">{label}</p>
          <p className="text-indigo-400 font-bold text-lg">
            {payload[0].value} <span className="text-xs text-slate-500 font-normal">hrs</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group h-80">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full filter blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <h3 className="text-xl font-bold text-white mb-6 drop-shadow-sm tracking-tight relative z-10">Study Hours (14 Days)</h3>
      
      <div className="w-full h-full pb-6 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
            <XAxis 
              dataKey="dateName" 
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#334155', strokeWidth: 1 }}
              dy={10}
              interval="preserveStartEnd"
              minTickGap={10}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip cursor={{ fill: '#1e293b', opacity: 0.5 }} content={<CustomTooltip />} />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]} maxBarSize={40} minPointSize={4}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.hours > 0 ? 'url(#colorHours)' : '#334155'} 
                  className={entry.hours > 0 ? "transition-all duration-300 hover:opacity-80 cursor-pointer" : ""}
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
