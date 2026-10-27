import { describe, expect, it } from 'vitest'
import { scalePoints, smoothPath } from './chart'

const pad = { top: 0, right: 0, bottom: 0, left: 0 }

describe('scalePoints', () => {
  it('spreads x by calendar time and flips y (bigger value = higher on screen)', () => {
    const { scaled } = scalePoints(
      [{ date: '2026-10-11', value: 190 }, { date: '2026-10-01', value: 180 }, { date: '2026-10-06', value: 185 }],
      100, 100, pad,
    )
    expect(scaled.map((p) => p.date)).toEqual(['2026-10-01', '2026-10-06', '2026-10-11'])
    expect(scaled.map((p) => p.x)).toEqual([0, 50, 100])
    expect(scaled[0].y).toBeGreaterThan(scaled[2].y)
  })
  it('centers a single point and survives a flat series', () => {
    const { scaled } = scalePoints([{ date: '2026-10-01', value: 5 }], 100, 50, pad)
    expect(scaled[0].x).toBe(50)
    expect(Number.isFinite(scaled[0].y)).toBe(true)
  })
  it('respects padding', () => {
    const { scaled } = scalePoints(
      [{ date: '2026-10-01', value: 1 }, { date: '2026-10-03', value: 2 }], 100, 100,
      { top: 10, right: 20, bottom: 10, left: 30 },
    )
    expect(scaled[0].x).toBe(30)
    expect(scaled[1].x).toBe(80)
  })
})

describe('smoothPath', () => {
  it('is empty for <2 points and starts with M otherwise', () => {
    expect(smoothPath([{ x: 1, y: 1 }])).toBe('')
    expect(smoothPath([{ x: 0, y: 0 }, { x: 10, y: 5 }]).startsWith('M0.00,0.00 C')).toBe(true)
  })
})
