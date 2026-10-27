import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Checkbox } from '../../components/ui/Checkbox'
import { TextInput } from '../../components/ui/Input'
import { useToday } from '../../hooks/useToday'
import { addDays, formatLong } from '../../lib/dates'
import { carryOverTasks, habitsForDate, toggleCheck } from '../../lib/today'
import { useStore } from '../../store/storeContext'
import { ManageHabits } from './ManageHabits'

export function TodayPage() {
  const { data, update } = useStore()
  const today = useToday()
  const [date, setDate] = useState(today)
  const [managing, setManaging] = useState(false)
  const [text, setText] = useState('')

  const isToday = date === today
  const habits = habitsForDate(data.habits, data.checks, date)
  const checked = new Set(data.checks[date] ?? [])
  const colorOf = (areaId: string) => data.areas.find((a) => a.id === areaId)?.color

  const tasks = useMemo(
    () => data.tasks.filter((t) => t.date === date).sort((a, b) => a.order - b.order),
    [data.tasks, date],
  )
  const carry = carryOverTasks(data.tasks, addDays(date, -1), date, () => crypto.randomUUID())

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const order = tasks.reduce((m, t) => Math.max(m, t.order + 1), 0)
    update((d) => ({ ...d, tasks: [...d.tasks, { id: crypto.randomUUID(), date, text: text.trim(), done: false, order }] }))
    setText('')
  }
  const setDone = (id: string, done: boolean) =>
    update((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, done } : t)) }))
  const removeTask = (id: string) => update((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }))

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[var(--text-muted)]">{formatLong(date)}</p>
          <h1 className="text-5xl font-semibold sm:text-6xl">{isToday ? 'Today' : 'Review'}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" aria-label="Previous day" onClick={() => setDate(addDays(date, -1))}>‹</Button>
          <Button variant="secondary" disabled={isToday} onClick={() => setDate(today)}>Today</Button>
          <Button variant="ghost" aria-label="Next day" onClick={() => setDate(addDays(date, 1))}>›</Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Daily habits</h2>
            <Button variant="ghost" onClick={() => setManaging((m) => !m)}>{managing ? 'Done' : 'Manage'}</Button>
          </div>
          {habits.length === 0 && <p className="text-[var(--text-muted)]">No habits yet. Tap Manage to add some.</p>}
          {habits.map((h) => (
            <Checkbox
              key={h.id}
              label={h.title}
              color={colorOf(h.areaId)}
              checked={checked.has(h.id)}
              onChange={() => update((d) => ({ ...d, checks: toggleCheck(d.checks, date, h.id) }))}
            />
          ))}
        </Card>

        <Card>
          <h2 className="mb-2 text-2xl font-semibold">Just {isToday ? 'today' : 'this day'}</h2>
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2">
              <Checkbox label={t.text} checked={t.done} onChange={(v) => setDone(t.id, v)} />
              <Button variant="ghost" aria-label={`Delete ${t.text}`} onClick={() => removeTask(t.id)}>×</Button>
            </div>
          ))}
          <form onSubmit={addTask} className="mt-3 flex gap-2">
            <TextInput aria-label="New task" placeholder="Add a task" value={text} onChange={(e) => setText(e.target.value)} className="min-w-0 flex-1" />
            <Button type="submit">Add</Button>
          </form>
          {carry.length > 0 && (
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => update((d) => ({ ...d, tasks: [...d.tasks, ...carryOverTasks(d.tasks, addDays(date, -1), date, () => crypto.randomUUID())] }))}
            >
              Carry over {carry.length} unfinished from yesterday
            </Button>
          )}
        </Card>
      </div>

      {managing && <ManageHabits />}
    </>
  )
}
