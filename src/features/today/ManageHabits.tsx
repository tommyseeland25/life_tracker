import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select, TextInput } from '../../components/ui/Input'
import { todayKey } from '../../lib/dates'
import { useStore } from '../../store/storeContext'
import { useState } from 'react'

/** Add / rename / re-area / reorder / archive habits. Archiving never deletes history. */
export function ManageHabits() {
  const { data, update } = useStore()
  const [title, setTitle] = useState('')
  const [areaId, setAreaId] = useState(data.areas[0]?.id ?? '')

  const active = data.habits.filter((h) => !h.archived).sort((a, b) => a.order - b.order)
  const archived = data.habits.filter((h) => h.archived)

  const patch = (id: string, p: Partial<(typeof data.habits)[number]>) =>
    update((d) => ({ ...d, habits: d.habits.map((h) => (h.id === id ? { ...h, ...p } : h)) }))

  // Swap with the neighbor, then renumber so `order` stays 0..n-1.
  const move = (index: number, dir: -1 | 1) => {
    const ids = active.map((h) => h.id)
    const j = index + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[index], ids[j]] = [ids[j], ids[index]]
    update((d) => ({ ...d, habits: d.habits.map((h) => (ids.includes(h.id) ? { ...h, order: ids.indexOf(h.id) } : h)) }))
  }

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    update((d) => ({
      ...d,
      habits: [
        ...d.habits,
        { id: crypto.randomUUID(), areaId, title: title.trim(), order: active.length, archived: false, createdAt: todayKey() },
      ],
    }))
    setTitle('')
  }

  return (
    <Card className="mt-6">
      <h2 className="text-2xl font-semibold">Manage habits</h2>
      <form onSubmit={add} className="mt-4 flex flex-wrap gap-2">
        <TextInput aria-label="New habit" placeholder="New daily habit" value={title} onChange={(e) => setTitle(e.target.value)} className="min-w-0 flex-1" />
        <Select aria-label="Area" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
          {data.areas.filter((a) => !a.archived).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </Select>
        <Button type="submit">Add</Button>
      </form>

      <ul className="mt-4 space-y-2">
        {active.map((h, i) => (
          <li key={h.id} className="flex flex-wrap items-center gap-2">
            <TextInput aria-label="Habit name" value={h.title} onChange={(e) => patch(h.id, { title: e.target.value })} className="min-w-0 flex-1" />
            <Select aria-label="Area" value={h.areaId} onChange={(e) => patch(h.id, { areaId: e.target.value })}>
              {data.areas.filter((a) => !a.archived || a.id === h.areaId).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </Select>
            <Button variant="ghost" aria-label={`Move ${h.title} up`} disabled={i === 0} onClick={() => move(i, -1)}>↑</Button>
            <Button variant="ghost" aria-label={`Move ${h.title} down`} disabled={i === active.length - 1} onClick={() => move(i, 1)}>↓</Button>
            <Button variant="secondary" onClick={() => patch(h.id, { archived: true })}>Archive</Button>
          </li>
        ))}
      </ul>

      {archived.length > 0 && (
        <>
          <h3 className="mb-2 mt-6 text-lg font-semibold text-[var(--text-muted)]">Archived</h3>
          <ul className="space-y-1">
            {archived.map((h) => (
              <li key={h.id} className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">{h.title}</span>
                <Button variant="ghost" onClick={() => patch(h.id, { archived: false, order: active.length })}>Restore</Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
