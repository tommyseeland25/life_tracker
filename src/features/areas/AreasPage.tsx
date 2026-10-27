import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ColorSwatches } from '../../components/ui/ColorSwatches'
import { TextInput } from '../../components/ui/Input'
import { formatShort } from '../../lib/dates'
import { useStore } from '../../store/storeContext'

export function AreasPage() {
  const { data, update } = useStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')

  const active = data.areas.filter((a) => !a.archived).sort((a, b) => a.order - b.order)
  const archived = data.areas.filter((a) => a.archived)

  const patch = (id: string, p: Partial<(typeof data.areas)[number]>) =>
    update((d) => ({ ...d, areas: d.areas.map((a) => (a.id === id ? { ...a, ...p } : a)) }))

  const move = (index: number, dir: -1 | 1) => {
    const ids = active.map((a) => a.id)
    const j = index + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[index], ids[j]] = [ids[j], ids[index]]
    update((d) => ({ ...d, areas: d.areas.map((a) => (ids.includes(a.id) ? { ...a, order: ids.indexOf(a.id) } : a)) }))
  }

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    update((d) => ({
      ...d,
      areas: [...d.areas, { id: crypto.randomUUID(), name: name.trim(), color: `var(--area-${(active.length % 8) + 1})`, order: active.length, archived: false, plan: '' }],
    }))
    setName('')
  }

  const lastEntry = (areaId: string) =>
    data.areaEntries.filter((e) => e.areaId === areaId).reduce<string>((m, e) => (e.date > m ? e.date : m), '')

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-5xl font-semibold sm:text-6xl">Areas</h1>
        <Button variant="secondary" onClick={() => setEditing((e) => !e)}>{editing ? 'Done' : 'Edit'}</Button>
      </div>

      {editing ? (
        <Card className="mt-10">
          <form onSubmit={add} className="flex gap-2">
            <TextInput aria-label="New area" placeholder="New area" value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 flex-1" />
            <Button type="submit">Add</Button>
          </form>
          <ul className="mt-4 space-y-3">
            {active.map((a, i) => (
              <li key={a.id} className="flex flex-wrap items-center gap-2">
                <TextInput aria-label="Area name" value={a.name} onChange={(e) => patch(a.id, { name: e.target.value })} className="min-w-0 flex-1" />
                <ColorSwatches value={a.color} onChange={(color) => patch(a.id, { color })} />
                <Button variant="ghost" aria-label={`Move ${a.name} up`} disabled={i === 0} onClick={() => move(i, -1)}>↑</Button>
                <Button variant="ghost" aria-label={`Move ${a.name} down`} disabled={i === active.length - 1} onClick={() => move(i, 1)}>↓</Button>
                <Button variant="secondary" onClick={() => patch(a.id, { archived: true })}>Archive</Button>
              </li>
            ))}
          </ul>
          {archived.length > 0 && (
            <>
              <h3 className="mb-2 mt-6 text-lg font-semibold text-[var(--text-muted)]">Archived</h3>
              {archived.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">{a.name}</span>
                  <Button variant="ghost" onClick={() => patch(a.id, { archived: false, order: active.length })}>Restore</Button>
                </div>
              ))}
            </>
          )}
        </Card>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {active.map((a) => {
            const habits = data.habits.filter((h) => h.areaId === a.id && !h.archived).length
            const last = lastEntry(a.id)
            return (
              <Link key={a.id} to={`/areas/${a.id}`} className="block rounded-[var(--radius-card)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                <Card whileHover={{ y: -3 }} className="h-full">
                  <span className="mb-4 block h-3 w-3 rounded-full" style={{ background: a.color }} />
                  <h2 className="text-2xl font-semibold">{a.name}</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {habits} {habits === 1 ? 'habit' : 'habits'}{last && ` · last entry ${formatShort(last)}`}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
