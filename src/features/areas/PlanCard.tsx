import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { TextArea } from '../../components/ui/Input'
import { useAutosave } from '../../hooks/useAutosave'
import { useStore } from '../../store/storeContext'

/** The pinned "current plan" note. Remounted per area (key in parent). */
export function PlanCard({ areaId }: { areaId: string }) {
  const { data, update } = useStore()
  const [text, setText] = useState(data.areas.find((a) => a.id === areaId)?.plan ?? '')
  const status = useAutosave(text, (plan) =>
    update((d) => ({ ...d, areas: d.areas.map((a) => (a.id === areaId ? { ...a, plan } : a)) })),
  )
  return (
    <Card>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold">Current plan</h2>
        <span role="status" className="text-sm text-[var(--text-muted)]">{status === 'saving' ? 'Saving…' : 'Saved'}</span>
      </div>
      <TextArea aria-label="Current plan" placeholder="What's the plan for this area right now?" value={text} onChange={(e) => setText(e.target.value)} className="min-h-32 w-full [field-sizing:content]" />
    </Card>
  )
}
