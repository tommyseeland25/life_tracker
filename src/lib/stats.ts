import type { Area, DateKey, Habit } from '../types/models'
import { addDays, daysBetween } from './dates'
import { habitsForDate } from './today'

/*
 * INSIGHTS MATH: the numbers behind every chart. This is the heart of the app.
 *
 * Shared fixture for the examples below (Michigan, week of Oct 20-26 2026):
 *
 *   habits:  g1 -> area "gym"       s1, s2 -> area "stretch"
 *   checks:  { '2026-10-20': ['g1','s1','s2'], '2026-10-22': ['s1'] }
 *   range:   ['2026-10-20', '2026-10-21', ..., '2026-10-26']   (7 days, oldest first)
 *
 * Reuse habitsForDate() from today.ts, and addDays/daysBetween from dates.ts.
 * Tests are in stats.test.ts. Run `npm test`.
 */

/** counts[i] belongs to range[i]. */
export type DailyCounts = Record<string, number[]>

/**
 * 1) How many check-offs did each area get on each day of the range?
 *
 *   dailyCountsByArea(habits, checks, range) ->
 *     gym:     [1, 0, 0, 0, 0, 0, 0]     // g1 on the 20th
 *     stretch: [2, 0, 1, 0, 0, 0, 0]     // s1+s2 on the 20th, s1 on the 22nd
 *
 * Rules:
 *  - One key per area that has at least one habit (archived habits count:
 *    their history is real). An area with habits but no checks gets all zeros.
 *  - Ignore checks outside the range and checks for habit ids that don't exist.
 *  - The array is aligned with `range`; same length, same order.
 *
 * Think about it: you could loop days then checks, or build a habitId -> areaId
 * lookup first. Which one makes the inner loop cheap?
 */
export function dailyCountsByArea(
  habits: Habit[],
  checks: Record<DateKey, string[]>,
  range: DateKey[],
): DailyCounts {
  // Look up a habit's area in O(1) instead of searching `habits` for every check.
  const areaOf = new Map(habits.map((h) => [h.id, h.areaId]))
  const out: DailyCounts = {}
  for (const h of habits) out[h.areaId] ??= range.map(() => 0)
  range.forEach((day, i) => {
    for (const id of checks[day] ?? []) {
      const areaId = areaOf.get(id)
      if (areaId) out[areaId][i]++
    }
  })
  return out
}

/**
 * 2) Total check-offs per area (feeds the donut).
 *
 *   totalsByArea({ gym: [1,0,0,0,0,0,0], stretch: [2,0,1,0,0,0,0] })
 *     -> { gym: 1, stretch: 3 }
 */
export function totalsByArea(counts: DailyCounts): Record<string, number> {
  return Object.fromEntries(Object.entries(counts).map(([id, c]) => [id, c.reduce((a, b) => a + b, 0)]))
}

/**
 * 3) "Stretched 1 of 7 days": per area, how many days in the range did you
 *    do at least one habit (done), out of the days it was possible (possible)?
 *
 *   completionByArea(habits, checks, range)
 *     -> gym: { done: 1, possible: 7 }, stretch: { done: 2, possible: 7 }
 *
 * A day is "possible" for an area when that area has at least one habit
 * showing on that day, which is exactly what habitsForDate() decides (so a
 * habit created on the 24th makes the 20th-23rd impossible, not "missed").
 * A day is "done" when at least one of those habits is checked.
 *
 * Example: area "ghost" has one archived habit "old", checked only on the 21st
 *   -> ghost: { done: 1, possible: 1 }  (it only existed, in history, that day)
 *
 * Areas with no habits at all are omitted.
 */
export function completionByArea(
  habits: Habit[],
  checks: Record<DateKey, string[]>,
  range: DateKey[],
): Record<string, { done: number; possible: number }> {
  const out: Record<string, { done: number; possible: number }> = {}
  for (const areaId of new Set(habits.map((h) => h.areaId))) {
    const mine = habits.filter((h) => h.areaId === areaId)
    let done = 0
    let possible = 0
    for (const day of range) {
      const shown = habitsForDate(mine, checks, day)
      if (shown.length === 0) continue
      possible++
      const checked = new Set(checks[day] ?? [])
      if (shown.some((h) => checked.has(h.id))) done++
    }
    out[areaId] = { done, possible }
  }
  return out
}

/**
 * 4) Current streak for one habit: consecutive days with a check, ending today.
 *    If today isn't checked YET, the streak is still alive: count back from
 *    yesterday (you don't lose it until the day is over).
 *
 *   checked: Oct 24, 25, 26          today = Oct 27 (unchecked)  -> 3
 *   checked: Oct 24, 25, 26, 27      today = Oct 27              -> 4
 *   checked: Oct 24, 25, (gap), 27   today = Oct 27              -> 1
 *   checked: Oct 23, 24              today = Oct 27              -> 0  (yesterday missed)
 *   nothing checked                                              -> 0
 *
 * It must cross month/year ends and DST correctly (use addDays).
 */
export function currentStreak(checks: Record<DateKey, string[]>, habitId: string, today: DateKey): number {
  const has = (d: DateKey) => (checks[d] ?? []).includes(habitId)
  // Today unchecked doesn't break the streak yet; start counting from yesterday.
  let day = has(today) ? today : addDays(today, -1)
  let n = 0
  while (has(day)) {
    n++
    day = addDays(day, -1)
  }
  return n
}

/**
 * 5) Longest run of consecutive checked days, ever.
 *
 *   checked: Oct 1, 2, 3, 10, 11   -> 3
 *   nothing checked                -> 0
 */
export function longestStreak(checks: Record<DateKey, string[]>, habitId: string): number {
  const days = Object.keys(checks).filter((d) => checks[d].includes(habitId)).sort()
  let best = 0
  let run = 0
  days.forEach((d, i) => {
    run = i > 0 && addDays(days[i - 1], 1) === d ? run + 1 : 1
    best = Math.max(best, run)
  })
  return best
}

export interface Neglected {
  area: Area
  /** Days since the last check in this area, or null if never checked. */
  daysSince: number | null
}

/**
 * 6) The gentle "you haven't touched this lately" list.
 *
 * An area is neglected when:
 *  - it isn't archived and has at least one non-archived habit, AND
 *  - its last check (any habit in the area, archived ones included, on or
 *    before today) is `windowDays` or more days ago, OR it was never checked
 *    AND its oldest active habit was created `windowDays`+ days ago
 *    (a habit you made 2 days ago hasn't been "neglected" yet).
 *
 * Sort: never-checked first, then largest daysSince first; ties by area.order.
 *
 * Example (today = Oct 27, windowDays = 7): gym last checked Oct 19 -> daysSince 8
 * (included); stretch last checked Oct 26 -> 1 (excluded); Oct 20 -> 7 (included);
 * Oct 21 -> 6 (excluded).
 */
export function neglectedAreas(
  areas: Area[],
  habits: Habit[],
  checks: Record<DateKey, string[]>,
  today: DateKey,
  windowDays = 7,
): Neglected[] {
  const out: Neglected[] = []
  for (const area of areas) {
    if (area.archived) continue
    const mine = habits.filter((h) => h.areaId === area.id)
    const active = mine.filter((h) => !h.archived)
    if (active.length === 0) continue

    const ids = new Set(mine.map((h) => h.id))
    let last: DateKey | null = null
    for (const [day, checked] of Object.entries(checks)) {
      if (day <= today && checked.some((id) => ids.has(id)) && (!last || day > last)) last = day
    }

    if (last) {
      const daysSince = daysBetween(last, today)
      if (daysSince >= windowDays) out.push({ area, daysSince })
    } else {
      // Never checked: only neglected once the oldest active habit is old enough.
      const oldest = active.map((h) => h.createdAt).sort()[0]
      if (daysBetween(oldest, today) >= windowDays) out.push({ area, daysSince: null })
    }
  }
  return out.sort((a, b) => (b.daysSince ?? Infinity) - (a.daysSince ?? Infinity) || a.area.order - b.area.order)
}
