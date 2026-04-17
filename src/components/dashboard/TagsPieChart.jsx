import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function TagsPieChart({ logs }) {
  const data = useMemo(() => {
    const tagMap = new Map()

    logs.forEach(log => {
      const hours = Number(log.hours || 0)
      if (log.tags && Array.isArray(log.tags)) {
        log.tags.forEach(tag => {
          const lowerTag = tag.toLowerCase()
          if (tagMap.has(lowerTag)) {
            tagMap.set(lowerTag, tagMap.get(lowerTag) + hours)
          } else {
            tagMap.set(lowerTag, hours)
          }
        })
      }
    })

    // Convert to array and sort by hours (top 5)
    return Array.from(tagMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 tags
  }, [logs])

  // Cinematic colors for the Pie slices
  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
          <p className="text-slate-300 font-medium text-sm">#{payload[0].name}</p>
          <p className="text-white font-bold pl-2">
            {payload[0].value.toFixed(1)} <span className="text-xs text-slate-500 font-normal">hrs</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group h-80 flex flex-col">
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full filter blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <h3 className="text-xl font-bold text-white mb-2 drop-shadow-sm tracking-tight relative z-10">Top Tags</h3>
      
      <div className="flex-1 w-full relative z-10">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
            No tags data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="hover:opacity-80 transition-opacity cursor-pointer drop-shadow-md"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-slate-400 text-xs font-medium ml-1">#{value}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
