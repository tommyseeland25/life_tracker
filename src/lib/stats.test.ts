import { describe, expect, it } from 'vitest'
import type { Area, Habit } from '../types/models'
import { dateRange } from './dates'
import { completionByArea, currentStreak, dailyCountsByArea, longestStreak, neglectedAreas, totalsByArea } from './stats'

const habit = (id: string, areaId: string, o: Partial<Habit> = {}): Habit => ({
  id, areaId, title: id, order: 0, archived: false, createdAt: '2026-10-01', ...o,
})
const area = (id: string, order: number, o: Partial<Area> = {}): Area => ({
  id, name: id, color: 'red', order, archived: false, plan: '', ...o,
})
const habits = [habit('g1', 'gym'), habit('s1', 'stretch'), habit('s2', 'stretch')]
const range = dateRange('2026-10-20', '2026-10-26')

describe('dailyCountsByArea', () => {
  it('counts check-offs per area per day, aligned with the range', () => {
    const checks = { '2026-10-20': ['g1', 's1', 's2'], '2026-10-22': ['s1'] }
    expect(dailyCountsByArea(habits, checks, range)).toEqual({
      gym: [1, 0, 0, 0, 0, 0, 0],
      stretch: [2, 0, 1, 0, 0, 0, 0],
    })
  })
  it('ignores checks outside the range and unknown habit ids', () => {
    const checks = { '2026-10-19': ['g1'], '2026-10-27': ['g1'], '2026-10-21': ['nope'] }
    expect(dailyCountsByArea(habits, checks, range).gym).toEqual([0, 0, 0, 0, 0, 0, 0])
  })
  it('keeps areas whose habits are archived, and omits areas with no habits', () => {
    const hs = [habit('old', 'ghost', { archived: true })]
    const out = dailyCountsByArea(hs, { '2026-10-21': ['old'] }, range)
    expect(Object.keys(out)).toEqual(['ghost'])
    expect(out.ghost).toEqual([0, 1, 0, 0, 0, 0, 0])
  })
})

describe('totalsByArea', () => {
  it('sums each area', () => {
    expect(totalsByArea({ gym: [1, 0, 0], stretch: [2, 0, 1] })).toEqual({ gym: 1, stretch: 3 })
  })
})

describe('completionByArea', () => {
  const checks = { '2026-10-20': ['g1', 's1', 's2'], '2026-10-22': ['s1'] }
  it('counts days with at least one check vs days possible', () => {
    expect(completionByArea(habits, checks, range)).toEqual({
      gym: { done: 1, possible: 7 },
      stretch: { done: 2, possible: 7 },
    })
  })
  it('a day with two checks in an area still counts once', () => {
    expect(completionByArea(habits, { '2026-10-20': ['s1', 's2'] }, range).stretch.done).toBe(1)
  })
  it('days before an area got its first habit are not possible', () => {
    const hs = [habit('n1', 'new', { createdAt: '2026-10-24' })]
    expect(completionByArea(hs, { '2026-10-25': ['n1'] }, range)).toEqual({ new: { done: 1, possible: 3 } })
  })
  it('an archived habit only exists on the days it was checked', () => {
    const hs = [habit('old', 'ghost', { archived: true })]
    expect(completionByArea(hs, { '2026-10-21': ['old'] }, range)).toEqual({ ghost: { done: 1, possible: 1 } })
  })
})

describe('currentStreak', () => {
  const run = (...dates: string[]) => Object.fromEntries(dates.map((d) => [d, ['h']]))
  it('counts back from yesterday when today is not checked yet', () => {
    expect(currentStreak(run('2026-10-24', '2026-10-25', '2026-10-26'), 'h', '2026-10-27')).toBe(3)
  })
  it('includes today when checked', () => {
    expect(currentStreak(run('2026-10-24', '2026-10-25', '2026-10-26', '2026-10-27'), 'h', '2026-10-27')).toBe(4)
  })
  it('stops at the first gap', () => {
    expect(currentStreak(run('2026-10-24', '2026-10-25', '2026-10-27'), 'h', '2026-10-27')).toBe(1)
  })
  it('is 0 when yesterday and today are both unchecked', () => {
    expect(currentStreak(run('2026-10-23', '2026-10-24'), 'h', '2026-10-27')).toBe(0)
    expect(currentStreak({}, 'h', '2026-10-27')).toBe(0)
  })
  it('only counts the given habit', () => {
    expect(currentStreak({ '2026-10-27': ['other'] }, 'h', '2026-10-27')).toBe(0)
  })
  it('crosses month ends and DST', () => {
    expect(currentStreak(run('2026-10-31', '2026-11-01', '2026-11-02'), 'h', '2026-11-02')).toBe(3)
  })
})

describe('longestStreak', () => {
  const run = (...dates: string[]) => Object.fromEntries(dates.map((d) => [d, ['h']]))
  it('finds the longest run', () => {
    expect(longestStreak(run('2026-10-01', '2026-10-02', '2026-10-03', '2026-10-10', '2026-10-11'), 'h')).toBe(3)
  })
  it('is 0 with no checks and 1 for a single day', () => {
    expect(longestStreak({}, 'h')).toBe(0)
    expect(longestStreak(run('2026-10-05'), 'h')).toBe(1)
  })
  it('handles unsorted input and DST', () => {
    expect(longestStreak(run('2026-11-02', '2026-10-31', '2026-11-01'), 'h')).toBe(3)
  })
})

describe('neglectedAreas', () => {
  const today = '2026-10-27'
  const areas = [area('gym', 0), area('stretch', 1), area('bjj', 2), area('rehab', 3)]
  const hs = [habit('g1', 'gym'), habit('s1', 'stretch'), habit('b1', 'bjj'), habit('r1', 'rehab', { createdAt: '2026-10-25' })]
  const ids = (checks: Record<string, string[]>, a = areas, h = hs) => neglectedAreas(a, h, checks, today).map((n) => n.area.id)

  it('includes areas last checked 7+ days ago, excludes 6 or fewer', () => {
    const checks = { '2026-10-19': ['g1'], '2026-10-20': ['s1'], '2026-10-21': ['b1'] }
    const out = neglectedAreas(areas, hs, checks, today)
    expect(out.map((n) => [n.area.id, n.daysSince])).toEqual([['gym', 8], ['stretch', 7]])
  })
  it('lists never-checked areas first (daysSince null), unless the habit is brand new', () => {
    const out = neglectedAreas(areas, hs, { '2026-10-26': ['g1', 's1'] }, today)
    expect(out.map((n) => [n.area.id, n.daysSince])).toEqual([['bjj', null]]) // rehab habit is only 2 days old
  })
  it('counts archived habits toward last-checked but ignores areas with no active habits', () => {
    const h2 = [habit('old', 'gym', { archived: true }), habit('s1', 'stretch')]
    expect(ids({ '2026-10-26': ['old', 's1'] }, areas, h2)).toEqual([])
  })
  it('skips archived areas and breaks ties by area order', () => {
    const a2 = [area('gym', 1), area('stretch', 0), area('bjj', 2, { archived: true })]
    expect(ids({ '2026-10-10': ['g1', 's1'] }, a2)).toEqual(['stretch', 'gym'])
  })
})
