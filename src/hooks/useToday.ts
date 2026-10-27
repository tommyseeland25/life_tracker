import { useEffect, useState } from 'react'
import { todayKey } from '../lib/dates'
import type { DateKey } from '../types/models'

/** Today's date key, kept fresh: updates at local midnight and when the tab becomes visible again. */
export function useToday(): DateKey {
  const [today, setToday] = useState(todayKey)

  useEffect(() => {
    const refresh = () => setToday(todayKey())
    let timer: number
    const schedule = () => {
      const now = new Date()
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timer = window.setTimeout(() => {
        refresh()
        schedule()
      }, nextMidnight.getTime() - now.getTime() + 1000)
    }
    schedule()
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return today
}
