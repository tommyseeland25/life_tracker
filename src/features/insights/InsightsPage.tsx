import { useMemo, useState } from 'react'
import { Donut } from '../../components/charts/Donut'
import { Heatmap } from '../../components/charts/Heatmap'
import { Card } from '../../components/ui/Card'
import { TabBar } from '../../components/ui/TabBar'
import { todayKey } from '../../lib/dates'
import { rangeFor, type RangePreset } from '../../lib/ranges'
import { completionByArea, currentStreak, dailyCountsByArea, longestStreak, neglectedAreas, totalsByArea } from '../../lib/stats'
import { useStore } from '../../store/storeContext'
import { ConsistencyCard, NeglectedCard, StreaksCard } from './Cards'

const PRESETS: RangePreset[] = ['Week', 'Month', 'All time']
const NEGLECT_DAYS = 7
const HEAT_DAYS = 30

export function InsightsPage() {
  const { data } = useStore()
  const [preset, setPreset] = useState<RangePreset>('Week')
  const today = todayKey()

  const stats = useMemo(() => {
    const range = rangeFor(preset, today, data.checks)
    const counts = dailyCountsByArea(data.habits, data.checks, range)
    return { range, counts, totals: totalsByArea(counts), completion: completionByArea(data.habits, data.checks, range) }
  }, [preset, today, data.habits, data.checks])

  // Areas worth showing: those with habits, hiding archived ones that have no activity here.
  const areas = data.areas
    .filter((a) => stats.counts[a.id] && (!a.archived || (stats.totals[a.id] ?? 0) > 0))
    .sort((a, b) => a.order - b.order)

  const totalChecks = areas.reduce((n, a) => n + (stats.totals[a.id] ?? 0), 0)
  const heatDays = stats.range.slice(-HEAT_DAYS)

  const streaks = data.habits
    .filter((h) => !h.archived)
    .map((h) => ({
      id: h.id,
      title: h.title,
      color: data.areas.find((a) => a.id === h.areaId)?.color ?? 'var(--accent)',
      current: currentStreak(data.checks, h.id, today),
      best: longestStreak(data.checks, h.id),
    }))
    .sort((a, b) => b.current - a.current || b.best - a.best)

  const neglected = neglectedAreas(data.areas, data.habits, data.checks, today, NEGLECT_DAYS)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl font-semibold sm:text-6xl">Insights</h1>
        <TabBar tabs={PRESETS} active={preset} onChange={(t) => setPreset(t as RangePreset)} />
      </div>

      {areas.length === 0 ? (
        <Card className="mt-10">
          <p className="text-[var(--text-muted)]">Add daily habits on the Today tab and check them off. Your charts appear here.</p>
        </Card>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card key={`donut-${preset}`}>
            <h2 className="mb-4 text-2xl font-semibold">Where your effort went</h2>
            <Donut
              slices={areas.map((a) => ({ id: a.id, label: a.name, value: stats.totals[a.id] ?? 0, color: a.color }))}
              centerLabel="check-offs"
            />
            <ul className="mt-5 space-y-1.5">
              {areas.map((a) => {
                const v = stats.totals[a.id] ?? 0
                return (
                  <li key={a.id} className="flex items-center gap-3 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
                    <span className="flex-1">{a.name}</span>
                    <span className="text-[var(--text-muted)]">{totalChecks ? Math.round((v / totalChecks) * 100) : 0}%</span>
                    <span className="w-8 text-right font-medium">{v}</span>
                  </li>
                )
              })}
            </ul>
          </Card>

          <ConsistencyCard
            key={`ring-${preset}`}
            rows={areas.map((a) => ({ id: a.id, name: a.name, color: a.color, ...(stats.completion[a.id] ?? { done: 0, possible: 0 }) }))}
          />

          <Card className="lg:col-span-2" key={`heat-${preset}`}>
            <h2 className="mb-4 text-2xl font-semibold">Last {heatDays.length} days</h2>
            <Heatmap
              days={heatDays}
              rows={areas.map((a) => ({ id: a.id, label: a.name, color: a.color, counts: stats.counts[a.id].slice(-HEAT_DAYS) }))}
            />
          </Card>

          <StreaksCard rows={streaks} />
          <NeglectedCard items={neglected} days={NEGLECT_DAYS} />
        </div>
      )}
    </>
  )
}
