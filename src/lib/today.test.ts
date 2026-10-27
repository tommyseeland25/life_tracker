import { describe, expect, it } from 'vitest'
import type { DailyTask, Habit } from '../types/models'
import { carryOverTasks, habitsForDate, toggleCheck } from './today'

const habit = (id: string, order: number, o: Partial<Habit> = {}): Habit => ({
  id, areaId: 'x', title: id, order, archived: false, createdAt: '2026-03-01', ...o,
})
const task = (id: string, date: string, o: Partial<DailyTask> = {}): DailyTask => ({
  id, date, text: id, done: false, order: 0, ...o,
})

describe('toggleCheck', () => {
  it('adds, then removes', () => {
    const on = toggleCheck({}, 'D1', 'a')
    expect(on).toEqual({ D1: ['a'] })
    expect(toggleCheck(on, 'D1', 'a')).toEqual({})
  })
  it('keeps other habits and other days', () => {
    expect(toggleCheck({ D1: ['a'], D2: ['z'] }, 'D1', 'b')).toEqual({ D1: ['a', 'b'], D2: ['z'] })
  })
  it('does not mutate its input', () => {
    const input = { D1: ['a'] }
    toggleCheck(input, 'D1', 'b')
    toggleCheck(input, 'D1', 'a')
    expect(input).toEqual({ D1: ['a'] })
  })
})

describe('habitsForDate', () => {
  const habits = [habit('b', 1), habit('a', 0), habit('late', 2, { createdAt: '2026-03-10' })]
  it('sorts by order and hides habits that did not exist yet', () => {
    expect(habitsForDate(habits, {}, '2026-03-05').map((h) => h.id)).toEqual(['a', 'b'])
    expect(habitsForDate(habits, {}, '2026-03-10').map((h) => h.id)).toEqual(['a', 'b', 'late'])
  })
  it('hides archived habits unless they were checked that day', () => {
    const hs = [habit('a', 0), habit('old', 1, { archived: true })]
    expect(habitsForDate(hs, {}, '2026-03-12').map((h) => h.id)).toEqual(['a'])
    expect(habitsForDate(hs, { '2026-03-12': ['old'] }, '2026-03-12').map((h) => h.id)).toEqual(['a', 'old'])
  })
  it('shows a habit checked on a day before its createdAt', () => {
    expect(habitsForDate(habits, { '2026-03-02': ['late'] }, '2026-03-02').map((h) => h.id)).toContain('late')
  })
})

describe('carryOverTasks', () => {
  let n = 0
  const newId = () => `new${++n}`
  it('copies only unfinished tasks to the new date, as fresh tasks', () => {
    const tasks = [task('t1', 'Y', { text: 'call mom' }), task('t2', 'Y', { text: 'laundry', done: true })]
    expect(carryOverTasks(tasks, 'Y', 'T', newId)).toEqual([
      { id: 'new1', date: 'T', text: 'call mom', done: false, order: 0 },
    ])
  })
  it('skips text already on the target day and continues order after existing tasks', () => {
    const tasks = [
      task('t1', 'Y', { text: 'call mom' }),
      task('t2', 'Y', { text: 'email prof' }),
      task('t3', 'T', { text: 'call mom', order: 4 }),
    ]
    const out = carryOverTasks(tasks, 'Y', 'T', newId)
    expect(out.map((t) => t.text)).toEqual(['email prof'])
    expect(out[0].order).toBe(5)
  })
  it('returns [] when there is nothing to carry', () => {
    expect(carryOverTasks([], 'Y', 'T', newId)).toEqual([])
  })
})
