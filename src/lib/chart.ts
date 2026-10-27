import type { DateKey } from '../types/models'
import { fromDateKey } from './dates'

export interface Pt {
  date: DateKey
  value: number
}
export interface Scaled extends Pt {
  x: number
  y: number
}
export interface Pad {
  top: number
  right: number
  bottom: number
  left: number
}

const DAY_MS = 86_400_000

/**
 * Map data points into SVG coordinates. X is proportional to calendar time
 * (a gap of 10 days looks 10x wider than 1 day); Y is padded 10% so the line
 * never touches the edges. A lone point (or all on one day) is centered.
 */
export function scalePoints(points: Pt[], w: number, h: number, pad: Pad) {
  const sorted = [...points].sort((a, b) => (a.date < b.date ? -1 : 1))
  const innerW = w - pad.left - pad.right
  const innerH = h - pad.top - pad.bottom
  const values = sorted.map((p) => p.value)
  let lo = Math.min(...values)
  let hi = Math.max(...values)
  if (hi === lo) {
    lo -= 1
    hi += 1
  }
  const margin = (hi - lo) * 0.1
  const yMin = lo - margin
  const yMax = hi + margin

  const t0 = sorted.length ? fromDateKey(sorted[0].date).getTime() : 0
  const dayOf = (d: DateKey) => Math.round((fromDateKey(d).getTime() - t0) / DAY_MS)
  const span = sorted.length ? dayOf(sorted[sorted.length - 1].date) : 0

  const scaled: Scaled[] = sorted.map((p) => ({
    ...p,
    x: pad.left + (span ? dayOf(p.date) / span : 0.5) * innerW,
    y: pad.top + (1 - (p.value - yMin) / (yMax - yMin)) * innerH,
  }))
  return { scaled, yMin, yMax }
}

/** Smooth curve through the points (Catmull-Rom converted to cubic Béziers). */
export function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  const f = (n: number) => n.toFixed(2)
  let d = `M${f(pts[0].x)},${f(pts[0].y)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(p2.x)},${f(p2.y)}`
  }
  return d
}
