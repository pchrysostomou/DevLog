import { useMemo } from 'react'
import { format, subDays } from 'date-fns'

export function useStreak(logs) {
  return useMemo(() => {
    if (!logs || logs.length === 0) return 0

    const logDates = new Set(logs.map(log => format(new Date(log.log_date), 'yyyy-MM-dd')))

    let currentStreak = 0
    let today = new Date()
    
    const todayStr = format(today, 'yyyy-MM-dd')
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd')

    let dateToCheck = today
    
    // Streak is active if user logged today OR yesterday
    if (logDates.has(todayStr)) {
      dateToCheck = today
    } else if (logDates.has(yesterdayStr)) {
      dateToCheck = subDays(today, 1)
    } else {
      return 0 // No logs recently, streak broken
    }

    // Count backwards
    while (logDates.has(format(dateToCheck, 'yyyy-MM-dd'))) {
      currentStreak++
      dateToCheck = subDays(dateToCheck, 1)
    }

    return currentStreak
  }, [logs])
}
