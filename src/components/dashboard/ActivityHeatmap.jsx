import { useMemo } from 'react'
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, isAfter } from 'date-fns'

export default function ActivityHeatmap({ logs }) {
  // Generate the last 20 weeks (around 140 days) for the heatmap
  const daysToShow = 140
  const endDate = new Date()
  const startDate = startOfWeek(subDays(endDate, daysToShow - 1))
  const endGridDate = endOfWeek(endDate) // Make sure grid ends on Saturday cleanly

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endGridDate })
  }, [startDate, endGridDate])

  const logActivityMap = useMemo(() => {
    const map = new Map()
    logs.forEach(log => {
      const dStr = format(new Date(log.log_date), 'yyyy-MM-dd')
      const hours = Number(log.hours || 0)
      if (map.has(dStr)) {
        map.set(dStr, map.get(dStr) + hours)
      } else {
        map.set(dStr, hours)
      }
    })
    return map
  }, [logs])

  const getIntensityClass = (hours) => {
    if (hours === 0) return 'bg-slate-800/50 border-slate-700/50'
    if (hours < 1) return 'bg-indigo-900 border-indigo-800 shadow-[0_0_5px_rgba(49,46,129,0.5)]'
    if (hours < 3) return 'bg-indigo-700 border-indigo-600 shadow-[0_0_8px_rgba(67,56,202,0.6)] text-indigo-100'
    if (hours < 5) return 'bg-indigo-500 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.7)] text-white'
    return 'bg-violet-400 border-violet-300 shadow-[0_0_15px_rgba(167,139,250,0.8)] text-white'
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-6 drop-shadow-sm tracking-tight">Activity Heatmap</h3>
        
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-max flex">
            {/* Y-axis labels (days) */}
            <div className="flex flex-col gap-[6px] mr-3 pt-6 text-[10px] font-medium text-slate-500 uppercase">
              <span className="h-[12px] leading-[12px]">Sun</span>
              <span className="h-[12px] leading-[12px]">Mon</span>
              <span className="h-[12px] leading-[12px]">Tue</span>
              <span className="h-[12px] leading-[12px]">Wed</span>
              <span className="h-[12px] leading-[12px]">Thu</span>
              <span className="h-[12px] leading-[12px]">Fri</span>
              <span className="h-[12px] leading-[12px]">Sat</span>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column', gap: '6px' }}>
              {days.map((day, i) => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const hours = logActivityMap.get(dateStr) || 0
                const isFuture = isAfter(day, endDate)

                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}: ${hours} hrs`}
                    className={`w-[12px] h-[12px] rounded-sm border transition-all duration-300 cursor-crosshair
                      ${isFuture ? 'bg-transparent border-transparent opacity-0' : getIntensityClass(hours)}
                    `}
                  ></div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end space-x-2 text-xs text-slate-400">
          <span>Less</span>
          <div className="w-[12px] h-[12px] rounded-sm bg-slate-800/50 border border-slate-700/50"></div>
          <div className="w-[12px] h-[12px] rounded-sm bg-indigo-900 border border-indigo-800"></div>
          <div className="w-[12px] h-[12px] rounded-sm bg-indigo-700 border border-indigo-600"></div>
          <div className="w-[12px] h-[12px] rounded-sm bg-indigo-500 border border-indigo-400"></div>
          <div className="w-[12px] h-[12px] rounded-sm bg-violet-400 border border-violet-300"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
