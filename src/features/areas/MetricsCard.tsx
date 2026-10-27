import { useState } from 'react'
import { LineChart } from '../../components/charts/LineChart'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select, TextInput } from '../../components/ui/Input'
import { formatShort, todayKey } from '../../lib/dates'
import { useStore } from '../../store/storeContext'

/** Optional numeric metrics over time (e.g. bodyweight, squat 1RM) with a line chart. */
export function MetricsCard({ areaId, color }: { areaId: string; color: string }) {
  const { data, update } = useStore()
  const metrics = data.areaMetrics.filter((m) => m.areaId === areaId)
  const names = [...new Set(metrics.map((m) => m.name))]

  const [picked, setPicked] = useState('')
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState(todayKey)
  const current = names.includes(picked) ? picked : names[0] ?? ''

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    const n = (name || current).trim()
    const v = Number(value)
    if (!n || value === '' || !Number.isFinite(v)) return
    update((d) => ({ ...d, areaMetrics: [...d.areaMetrics, { id: crypto.randomUUID(), areaId, date, name: n, value: v }] }))
    setPicked(n)
    setName('')
    setValue('')
  }

  const series = metrics.filter((m) => m.name === current)
  // One point per day: if several were logged, the latest one wins.
  const byDay = new Map(series.map((m) => [m.date, m.value]))
  const points = [...byDay].map(([date, value]) => ({ date, value }))
  const recent = [...series].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5)

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Metrics</h2>
        {names.length > 1 && (
          <Select aria-label="Metric" value={current} onChange={(e) => setPicked(e.target.value)}>
            {names.map((n) => <option key={n}>{n}</option>)}
          </Select>
        )}
      </div>

      {points.length > 0 ? (
        <div key={current}>
          {names.length === 1 && <p className="text-sm text-[var(--text-muted)]">{current}</p>}
          <LineChart points={points} color={color} />
        </div>
      ) : (
        <p className="text-[var(--text-muted)]">Track a number over time, like bodyweight or a lift. Add your first value below.</p>
      )}

      <form onSubmit={add} className="mt-4 flex flex-wrap gap-2">
        <TextInput aria-label="Metric name" list="metric-names" placeholder={current || 'Name (e.g. Bodyweight)'} value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 flex-1 basis-40" />
        <datalist id="metric-names">{names.map((n) => <option key={n} value={n} />)}</datalist>
        <TextInput type="number" step="any" inputMode="decimal" aria-label="Value" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} className="w-28" />
        <TextInput type="date" aria-label="Metric date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>

      {recent.length > 0 && (
        <ul className="mt-4 divide-y divide-[var(--hairline)]">
          {recent.map((m) => (
            <li key={m.id} className="grid grid-cols-[1fr_auto_3rem] items-center gap-3 py-1.5 text-sm">
              <span className="text-[var(--text-muted)]">{formatShort(m.date)}</span>
              <span className="font-medium">{m.value}</span>
              <Button variant="ghost" aria-label={`Delete ${m.name} on ${m.date}`} onClick={() => update((d) => ({ ...d, areaMetrics: d.areaMetrics.filter((x) => x.id !== m.id) }))}>×</Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
