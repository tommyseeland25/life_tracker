import { motion } from 'framer-motion'
import { formatShort } from '../../lib/dates'

export interface HeatRow {
  id: string
  label: string
  color: string
  counts: number[]
}

/** Rows = areas, columns = days. Cell intensity is relative to that area's busiest day. */
export function Heatmap({ days, rows }: { days: string[]; rows: HeatRow[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[22rem] items-center gap-x-1 gap-y-1.5" style={{ gridTemplateColumns: `7.5rem repeat(${days.length}, minmax(0, 1fr))` }}>
        <span />
        {days.map((d, i) => (
          <span key={d} className="text-center text-[10px] text-[var(--text-muted)]">
            {days.length <= 14 || i % 7 === 0 ? Number(d.slice(8)) : ''}
          </span>
        ))}
        {rows.map((r, ri) => {
          const max = Math.max(...r.counts, 1)
          return (
            <div key={r.id} className="contents">
              <span className="truncate pr-2 text-sm">{r.label}</span>
              {r.counts.map((c, i) => (
                <motion.span
                  key={days[i]}
                  title={`${r.label}, ${formatShort(days[i])}: ${c}`}
                  aria-label={`${r.label}, ${formatShort(days[i])}: ${c} check-offs`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26, delay: Math.min(ri * 0.03 + i * 0.008, 0.5) }}
                  className="h-8 rounded-[6px]"
                  style={{ background: c > 0 ? `color-mix(in srgb, ${r.color} ${Math.round(35 + 65 * (c / max))}%, transparent)` : 'var(--hairline)' }}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
