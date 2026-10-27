import type { DateKey } from '../types/models'
import { addDays, fromDateKey, toDateKey } from './dates'

export const startOfMonth = (key: DateKey): DateKey => `${key.slice(0, 7)}-01`

/** First day of the month n months away (n may be negative). */
export function addMonths(key: DateKey, n: number): DateKey {
  const [y, m] = key.split('-').map(Number)
  return toDateKey(new Date(y, m - 1 + n, 1))
}

export interface GridDay {
  date: DateKey
  inMonth: boolean
}

/** Sunday-first weeks covering the month; leading/trailing days belong to neighbor months. */
export function monthGrid(key: DateKey): GridDay[][] {
  const monthPrefix = key.slice(0, 7)
  const first = fromDateKey(startOfMonth(key))
  let cursor = addDays(toDateKey(first), -first.getDay())
  const weeks: GridDay[][] = []
  while (cursor.slice(0, 7) <= monthPrefix || weeks.length === 0) {
    const week: GridDay[] = []
    for (let i = 0; i < 7; i++) {
      week.push({ date: cursor, inMonth: cursor.slice(0, 7) === monthPrefix })
      cursor = addDays(cursor, 1)
    }
    weeks.push(week)
  }
  return weeks
}
