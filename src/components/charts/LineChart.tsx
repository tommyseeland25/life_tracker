import { motion, useReducedMotion } from 'framer-motion'
import { useId, useState } from 'react'
import { scalePoints, smoothPath, type Pt } from '../../lib/chart'
import { formatShort } from '../../lib/dates'

const W = 600
const H = 220
const PAD = { top: 16, right: 16, bottom: 28, left: 44 }
const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })

/** Smooth animated line with a soft gradient fill. Hover/touch to read a point. */
export function LineChart({ points, color, unit = '' }: { points: Pt[]; color: string; unit?: string }) {
  const gradId = useId()
  const reduce = useReducedMotion()
  const { scaled, yMin, yMax } = scalePoints(points, W, H, PAD)
  const [hover, setHover] = useState<number | null>(null)
  if (scaled.length === 0) return null

  const active = scaled[hover ?? scaled.length - 1]
  const line = smoothPath(scaled)
  const baseY = H - PAD.bottom
  const area = scaled.length > 1 ? `${line} L${scaled[scaled.length - 1].x},${baseY} L${scaled[0].x},${baseY} Z` : ''
  const ticks = [0, 0.5, 1].map((t) => ({ y: PAD.top + (1 - t) * (H - PAD.top - PAD.bottom), v: yMin + t * (yMax - yMin) }))

  // Pick the point whose x is closest to the pointer (converted from CSS px to viewBox units).
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    let best = 0
    scaled.forEach((p, i) => {
      if (Math.abs(p.x - x) < Math.abs(scaled[best].x - x)) best = i
    })
    setHover(best)
  }

  return (
    <div>
      <p className="mb-1 text-sm text-[var(--text-muted)]" aria-live="polite">
        {formatShort(active.date)} · <span className="font-semibold text-[var(--text)]">{fmt.format(active.value)}{unit}</span>
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-pan-y"
        role="img"
        aria-label={`Line chart, ${scaled.length} points, latest ${fmt.format(scaled[scaled.length - 1].value)}${unit}`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t.y}>
            <line x1={PAD.left} x2={W - PAD.right} y1={t.y} y2={t.y} stroke="var(--hairline)" />
            <text x={PAD.left - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">{fmt.format(t.v)}</text>
          </g>
        ))}
        {area && (
          <motion.path d={area} fill={`url(#${gradId})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.3 }} />
        )}
        {line && (
          <motion.path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <text x={PAD.left} y={H - 8} fontSize="11" fill="var(--text-muted)">{formatShort(scaled[0].date)}</text>
        {scaled.length > 1 && (
          <text x={W - PAD.right} y={H - 8} textAnchor="end" fontSize="11" fill="var(--text-muted)">{formatShort(scaled[scaled.length - 1].date)}</text>
        )}
        <circle cx={active.x} cy={active.y} r={5} fill="var(--surface-solid)" stroke={color} strokeWidth={3} />
      </svg>
    </div>
  )
}
