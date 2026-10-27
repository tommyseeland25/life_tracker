import { Ring } from '../../components/charts/Ring'
import { Card } from '../../components/ui/Card'
import type { Neglected } from '../../lib/stats'

export function StreaksCard({ rows }: { rows: { id: string; title: string; color: string; current: number; best: number }[] }) {
  return (
    <Card>
      <h2 className="mb-3 text-2xl font-semibold">Streaks</h2>
      {rows.length === 0 && <p className="text-[var(--text-muted)]">Add daily habits to start streaks.</p>}
      <ul className="divide-y divide-[var(--hairline)]">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-3 py-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.color }} />
            <span className="min-w-0 flex-1 truncate">{r.title}</span>
            <span className="text-sm text-[var(--text-muted)]">best {r.best}</span>
            <span className="w-16 text-right font-semibold">{r.current} {r.current === 1 ? 'day' : 'days'}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function NeglectedCard({ items, days }: { items: Neglected[]; days: number }) {
  return (
    <Card className={items.length ? 'bg-[var(--accent-soft)]' : ''}>
      <h2 className="mb-1 text-2xl font-semibold">{items.length ? 'Worth a look' : 'All caught up'}</h2>
      {items.length === 0 ? (
        <p className="text-[var(--text-muted)]">Every area with habits has had attention in the last {days} days.</p>
      ) : (
        <>
          <p className="mb-3 text-[var(--text-muted)]">No check-offs in the last {days} days:</p>
          <ul className="space-y-2">
            {items.map(({ area, daysSince }) => (
              <li key={area.id} className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: area.color }} />
                <span className="flex-1">{area.name}</span>
                <span className="text-sm text-[var(--text-muted)]">{daysSince === null ? 'not started yet' : `${daysSince} days ago`}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}

export function ConsistencyCard({ rows }: { rows: { id: string; name: string; color: string; done: number; possible: number }[] }) {
  return (
    <Card>
      <h2 className="mb-4 text-2xl font-semibold">Consistency</h2>
      {rows.length === 0 && <p className="text-[var(--text-muted)]">Nothing to measure yet.</p>}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
        {rows.map((r) => {
          const p = r.possible ? r.done / r.possible : 0
          return (
            <div key={r.id} className="flex flex-col items-center text-center">
              <Ring progress={p} color={r.color}>{Math.round(p * 100)}%</Ring>
              <p className="mt-2 text-sm font-medium leading-tight">{r.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{r.done} of {r.possible} {r.possible === 1 ? 'day' : 'days'}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
