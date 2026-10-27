import { motion, useReducedMotion } from 'framer-motion'
import { donutSegments } from '../../lib/chart'

export interface Slice {
  id: string
  label: string
  value: number
  color: string
}

const R = 70
const GAP = 0.008 // small visual gap between arcs (fraction of the circle)

/** Donut chart. Each arc draws in clockwise with a light stagger. */
export function Donut({ slices, centerLabel }: { slices: Slice[]; centerLabel: string }) {
  const reduce = useReducedMotion()
  const total = slices.reduce((a, s) => a + s.value, 0)
  const segs = donutSegments(slices.map((s) => s.value))
  const single = slices.filter((s) => s.value > 0).length === 1

  return (
    <div className="relative mx-auto aspect-square w-full max-w-60">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" role="img" aria-label={`Share of check-offs: ${slices.map((s) => `${s.label} ${s.value}`).join(', ')}`}>
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--hairline)" strokeWidth="22" />
        {slices.map((s, i) =>
          s.value > 0 ? (
            <motion.circle
              key={s.id}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="22"
              initial={{ pathLength: reduce ? 1 : 0, pathOffset: segs[i].offset }}
              animate={{ pathLength: Math.max(segs[i].fraction - (single ? 0 : GAP), 0), pathOffset: segs[i].offset }}
              transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : null,
        )}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-4xl font-semibold tracking-tight">{total}</span>
        <span className="text-sm text-[var(--text-muted)]">{centerLabel}</span>
      </div>
    </div>
  )
}
