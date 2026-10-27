import type { DateKey } from '../types/models'
import { todo } from './todo'

/*
 * DATE KEYS: the whole app is keyed by local calendar date, 'YYYY-MM-DD'.
 *
 * YOUR JOB: implement these three. The two traps this file exists to teach:
 *
 *  1. toISOString() is UTC. At 11:30pm in Michigan it already says "tomorrow".
 *     A date key must come from the LOCAL year/month/day.
 *
 *  2. `new Date('2026-03-08')` parses as UTC midnight, which is the evening of
 *     March 7 locally. Build local dates from numeric parts instead.
 *     Likewise, "add 24 hours" is wrong on the two days a year (DST) that
 *     are 23 or 25 hours long. Add to the calendar day, not to milliseconds.
 *
 * Worked examples (Michigan, America/Detroit):
 *   toDateKey(new Date(2026, 0, 5, 23, 30))   -> '2026-01-05'   (month is 0-based!)
 *   fromDateKey('2026-03-08')                 -> local midnight, March 8
 *   addDays('2026-03-07', 2)                  -> '2026-03-09'   (DST starts Mar 8)
 *   addDays('2026-01-01', -1)                 -> '2025-12-31'
 *
 * Hint: zero-pad month/day (String(n).padStart(2, '0')).
 */

/** Local date -> 'YYYY-MM-DD'. */
export function toDateKey(date: Date): DateKey {
  return todo('toDateKey', date)
}

/** 'YYYY-MM-DD' -> Date at local midnight. */
export function fromDateKey(key: DateKey): Date {
  return todo('fromDateKey', key)
}

/** Shift a key by n calendar days (n may be negative). */
export function addDays(key: DateKey, n: number): DateKey {
  return todo('addDays', key, n)
}

// --- Provided for you (built on the three above) ---

export const todayKey = (): DateKey => toDateKey(new Date())

/** "Tuesday, October 27" */
export function formatLong(key: DateKey): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(fromDateKey(key))
}
