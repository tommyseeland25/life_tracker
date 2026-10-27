import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { TextArea } from '../../components/ui/Input'
import { useAutosave } from '../../hooks/useAutosave'
import { formatLong } from '../../lib/dates'
import { useStore } from '../../store/storeContext'

/** Remounted per date (key in the parent), so local state always matches the day shown. */
export function JournalEditor({ date }: { date: string }) {
  const { data, update } = useStore()
  const [text, setText] = useState(data.journal[date]?.text ?? '')

  const status = useAutosave(text, (value) =>
    update((d) => {
      // An emptied entry is removed so "no entry" stays distinguishable from "blank entry".
      const { [date]: _old, ...rest } = d.journal
      return { ...d, journal: value.trim() ? { ...rest, [date]: { text: value, updatedAt: new Date().toISOString() } } : rest }
    }),
  )

  return (
    <Card>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold">{formatLong(date)}</h2>
        <span role="status" className="text-sm text-[var(--text-muted)]">{status === 'saving' ? 'Saving…' : 'Saved'}</span>
      </div>
      <TextArea
        aria-label="What I did today"
        placeholder="What did you do today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-56 w-full [field-sizing:content]"
      />
    </Card>
  )
}
