import type { DailyTask, DateKey, Habit } from '../types/models'

/*
 * "WHAT DOES A DAY LOOK LIKE": the daily-reset behavior from your spec.
 * Nothing is ever deleted; a "new day" is simply a date key with no entries.
 *
 * YOUR JOB: implement the three functions below. Tests in today.test.ts
 * describe the behavior; run `npm test` and make them go green.
 */

/**
 * Return a NEW checks object with `habitId` toggled on `date`.
 *
 *   toggleCheck({}, 'D1', 'a')                     -> { D1: ['a'] }
 *   toggleCheck({ D1: ['a'] }, 'D1', 'b')          -> { D1: ['a', 'b'] }
 *   toggleCheck({ D1: ['a'] }, 'D1', 'a')          -> {}    // empty days vanish
 *
 * Rules: never mutate the input (React state!), and don't leave an empty
 * array behind, so "no key" keeps meaning "nothing happened that day".
 */
export function toggleCheck(
  checks: Record<DateKey, string[]>,
  date: DateKey,
  habitId: string,
): Record<DateKey, string[]> {
  const current = checks[date] ?? []
  const next = current.includes(habitId) ? current.filter((id) => id !== habitId) : [...current, habitId]
  const { [date]: _removed, ...rest } = checks
  return next.length > 0 ? { ...rest, [date]: next } : rest
}

/**
 * Which habits should appear on the checklist for `date`, sorted by `order`?
 *
 * A habit appears on `date` if:
 *   - it is not archived AND it existed by then (createdAt <= date), OR
 *   - it was checked on that date (so old history never silently disappears,
 *     even if the habit has since been archived).
 *
 * Example: habit created 2026-03-10.
 *   viewing 2026-03-01 -> hidden (didn't exist yet)
 *   viewing 2026-03-10 -> shown
 *   archived later, but checked on 2026-03-12 -> still shown on 03-12 only
 *
 * Hint: 'YYYY-MM-DD' strings compare correctly with plain < and <=.
 */
export function habitsForDate(
  habits: Habit[],
  checks: Record<DateKey, string[]>,
  date: DateKey,
): Habit[] {
  const checked = new Set(checks[date] ?? [])
  return habits
    .filter((h) => checked.has(h.id) || (!h.archived && h.createdAt <= date))
    .sort((a, b) => a.order - b.order)
}

/**
 * The tasks that a one-tap "carry over" would add to `toDate`:
 * copies of UNFINISHED tasks from `fromDate`, as new tasks (fresh id, date =
 * toDate, done = false). Skip any whose text is already on `toDate` so
 * tapping twice never duplicates. New tasks' `order` continues after the
 * highest existing order on `toDate` (or starts at 0 if it has none).
 * The originals are never touched; yesterday stays as history.
 *
 * Example: from has [{text:'call mom', done:false}, {text:'laundry', done:true}],
 * to already has 'call mom' -> result is [] (laundry was done; call mom exists).
 *
 * `newId` is injected so tests get predictable ids (the app passes crypto.randomUUID).
 */
export function carryOverTasks(
  tasks: DailyTask[],
  fromDate: DateKey,
  toDate: DateKey,
  newId: () => string,
): DailyTask[] {
  const existing = tasks.filter((t) => t.date === toDate)
  const existingText = new Set(existing.map((t) => t.text))
  let order = existing.reduce((max, t) => Math.max(max, t.order + 1), 0)
  return tasks
    .filter((t) => t.date === fromDate && !t.done && !existingText.has(t.text))
    .sort((a, b) => a.order - b.order)
    .map((t) => ({ id: newId(), date: toDate, text: t.text, done: false, order: order++ }))
}
