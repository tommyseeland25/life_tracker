import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Checkbox } from '../../components/ui/Checkbox'
import { DataCard } from './DataCard'

const SAMPLE = [
  { label: 'Stretch', color: 'var(--area-3)' },
  { label: 'Gym', color: 'var(--area-1)' },
  { label: 'Read 20 pages', color: 'var(--area-4)' },
  { label: 'Code for an hour', color: 'var(--area-2)' },
]

export function Showcase() {
  const [done, setDone] = useState<Record<string, boolean>>({ Stretch: true })

  return (
    <>
      <div>
        <p className="text-[var(--text-muted)]">Design system</p>
        <h1 className="mt-1 text-5xl font-semibold sm:text-6xl">Components</h1>
        <p className="mt-3 max-w-prose text-lg text-[var(--text-muted)]">
          Tap the tabs, check things off, toggle the theme. This page is only here to lock in the look.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card>
            <h2 className="mb-3 text-2xl font-semibold">Checklist</h2>
            {SAMPLE.map((s) => (
              <Checkbox
                key={s.label}
                label={s.label}
                color={s.color}
                checked={!!done[s.label]}
                onChange={(v) => setDone((d) => ({ ...d, [s.label]: v }))}
              />
            ))}
          </Card>

          <Card>
            <h2 className="mb-3 text-2xl font-semibold">Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </div>
            <h2 className="mb-3 mt-8 text-2xl font-semibold">Area colors</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <span key={n} className="h-7 w-7 rounded-full" style={{ background: `var(--area-${n})` }} />
              ))}
            </div>
          </Card>

          <Card className="sm:col-span-2">
            <h2 className="text-2xl font-semibold">Typography</h2>
            <p className="mt-3 text-4xl font-semibold">Large confident heading</p>
            <p className="mt-2 text-[var(--text-muted)]">
              Body text sits on a generous line height with lots of air around it. Surfaces are frosted
              glass, corners are large, and shadows are soft and layered instead of borders.
            </p>
          </Card>

          <DataCard />
        </div>
      </div>
    </>
  )
}
