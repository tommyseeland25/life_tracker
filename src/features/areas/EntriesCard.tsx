import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { TextArea, TextInput } from '../../components/ui/Input'
import { formatLong, todayKey } from '../../lib/dates'
import type { AreaEntry } from '../../types/models'
import { useStore } from '../../store/storeContext'

function Item({ entry }: { entry: AreaEntry }) {
  const { update } = useStore()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(entry.text)
  const save = () => {
    update((d) => ({ ...d, areaEntries: d.areaEntries.map((e) => (e.id === entry.id ? { ...e, text } : e)) }))
    setEditing(false)
  }
  return (
    <li className="py-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-muted)]">{formatLong(entry.date)}</span>
        <div className="flex">
          <Button variant="ghost" onClick={() => setEditing((e) => !e)}>{editing ? 'Cancel' : 'Edit'}</Button>
          <Button variant="ghost" aria-label="Delete entry" onClick={() => update((d) => ({ ...d, areaEntries: d.areaEntries.filter((e) => e.id !== entry.id) }))}>Delete</Button>
        </div>
      </div>
      {editing ? (
        <div className="mt-2 space-y-2">
          <TextArea aria-label="Edit entry" value={text} onChange={(e) => setText(e.target.value)} className="w-full [field-sizing:content]" />
          <Button onClick={save}>Save</Button>
        </div>
      ) : (
        <p className="mt-1 whitespace-pre-wrap">{entry.text}</p>
      )}
    </li>
  )
}

export function EntriesCard({ areaId }: { areaId: string }) {
  const { data, update } = useStore()
  const [date, setDate] = useState(todayKey)
  const [text, setText] = useState('')

  // Newest date first; within a day, most recently added first.
  const entries = data.areaEntries
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => e.areaId === areaId)
    .sort((a, b) => (a.e.date === b.e.date ? b.i - a.i : a.e.date < b.e.date ? 1 : -1))
    .map(({ e }) => e)

  const add = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!text.trim()) return
    update((d) => ({ ...d, areaEntries: [...d.areaEntries, { id: crypto.randomUUID(), areaId, date, text: text.trim() }] }))
    setText('')
  }

  return (
    <Card>
      <h2 className="mb-3 text-2xl font-semibold">Log</h2>
      <form onSubmit={add} className="space-y-2">
        <TextInput type="date" aria-label="Entry date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
        <TextArea aria-label="New entry" placeholder="Workout notes, how it felt, what changed…" value={text} onChange={(e) => setText(e.target.value)} className="min-h-24 w-full [field-sizing:content]" />
        <Button type="submit">Add entry</Button>
      </form>
      <ul className="mt-4 divide-y divide-[var(--hairline)]">
        {entries.length === 0 && <li className="py-3 text-[var(--text-muted)]">No entries yet.</li>}
        {entries.map((e) => <Item key={e.id} entry={e} />)}
      </ul>
    </Card>
  )
}
