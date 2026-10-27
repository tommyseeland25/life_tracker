import { describe, expect, it } from 'vitest'
import { addMonths, monthGrid } from './calendar'

describe('monthGrid', () => {
  it('October 2026 starts the grid on Sunday Sep 27 and has 5 weeks', () => {
    const g = monthGrid('2026-10-15')
    expect(g).toHaveLength(5)
    expect(g[0][0]).toEqual({ date: '2026-09-27', inMonth: false })
    expect(g[0][4]).toEqual({ date: '2026-10-01', inMonth: true })
    expect(g[4][6]).toEqual({ date: '2026-10-31', inMonth: true })
  })
  it('February 2026 fits exactly 4 weeks (starts Sunday, 28 days)', () => {
    const g = monthGrid('2026-02-10')
    expect(g).toHaveLength(4)
    expect(g.flat().every((d) => d.inMonth)).toBe(true)
  })
  it('every week has 7 days', () => {
    for (const w of monthGrid('2026-08-01')) expect(w).toHaveLength(7)
  })
})

describe('addMonths', () => {
  it('moves across year boundaries and lands on the 1st', () => {
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-01')
    expect(addMonths('2026-01-31', -1)).toBe('2025-12-01')
  })
})
