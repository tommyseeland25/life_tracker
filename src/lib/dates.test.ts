import { describe, expect, it } from 'vitest'

// vite.config.ts runs tests in America/Detroit so UTC-vs-local and DST bugs actually show up.
import { addDays, fromDateKey, toDateKey } from './dates'

describe('toDateKey', () => {
  it('zero-pads month and day', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
  it('uses LOCAL date, not UTC (11:30pm is still today)', () => {
    expect(toDateKey(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05')
  })
})

describe('fromDateKey', () => {
  it('returns local midnight of that day', () => {
    const d = fromDateKey('2026-03-08')
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 2, 8, 0])
  })
  it('round-trips with toDateKey', () => {
    expect(toDateKey(fromDateKey('2026-12-31'))).toBe('2026-12-31')
  })
})

describe('addDays', () => {
  it('moves forward and backward', () => {
    expect(addDays('2026-10-27', 1)).toBe('2026-10-28')
    expect(addDays('2026-10-27', -1)).toBe('2026-10-26')
  })
  it('crosses month and year boundaries', () => {
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01')
  })
  it('is correct across DST start (Mar 8 2026 is 23 hours long)', () => {
    expect(addDays('2026-03-07', 2)).toBe('2026-03-09')
    expect(addDays('2026-03-09', -2)).toBe('2026-03-07')
  })
  it('is correct across DST end (Nov 1 2026 is 25 hours long)', () => {
    expect(addDays('2026-10-31', 2)).toBe('2026-11-02')
  })
})
