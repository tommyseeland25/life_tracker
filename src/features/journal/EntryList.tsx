import { Card } from '../../components/ui/Card'
import { TextInput } from '../../components/ui/Input'
import { formatShort } from '../../lib/dates'
import type { JournalHit } from '../../lib/journal'

interface Props {
  hits: JournalHit[]
  query: string
  onQuery: (q: string) => void
  selected: string
  onSelect: (date: string) => void
}

export function EntryList({ hits, query, onQuery, selected, onSelect }: Props) {
  return (
    <Card>
      <TextInput type="search" aria-label="Search journal" placeholder="Search entries" value={query} onChange={(e) => onQuery(e.target.value)} className="w-full" />
      <ul className="mt-3 max-h-96 space-y-1 overflow-y-auto">
        {hits.length === 0 && (
          <li className="py-4 text-[var(--text-muted)]">{query ? 'No matches.' : 'No entries yet. Start writing above.'}</li>
        )}
        {hits.map((h) => (
          <li key={h.date}>
            <button
              onClick={() => onSelect(h.date)}
              aria-current={h.date === selected}
              className={`w-full rounded-[var(--radius-control)] px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${h.date === selected ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--hairline)]'}`}
            >
              <span className="block text-sm font-medium">{formatShort(h.date)}</span>
              <span className="line-clamp-2 text-sm text-[var(--text-muted)]">{h.snippet}</span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
