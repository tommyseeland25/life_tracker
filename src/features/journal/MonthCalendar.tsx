import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { monthGrid } from '../../lib/calendar'
import { useToday } from '../../hooks/useToday'
import { formatLong, formatMonth } from '../../lib/dates'

interface Props {
  month: string
  selected: string
  withEntries: Set<string>
  onSelect: (date: string) => void
  onMonth: (delta: number) => void
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function MonthCalendar({ month, selected, withEntries, onSelect, onMonth }: Props) {
  const today = useToday()
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{formatMonth(month)}</h2>
        <div className="flex">
          <Button variant="ghost" aria-label="Previous month" onClick={() => onMonth(-1)}>‹</Button>
          <Button variant="ghost" aria-label="Next month" onClick={() => onMonth(1)}>›</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-[var(--text-muted)]">
        {WEEKDAYS.map((d, i) => <span key={i} className="py-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {monthGrid(month).flat().map(({ date, inMonth }) => {
          const isSelected = date === selected
          return (
            <button
              key={date}
              onClick={() => onSelect(date)}
              aria-label={`${formatLong(date)}${withEntries.has(date) ? ', has entry' : ''}`}
              aria-pressed={isSelected}
              className={`relative mx-auto grid h-10 w-10 place-items-center rounded-full text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                isSelected
                  ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                  : date === today
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : inMonth ? 'hover:bg-[var(--hairline)]' : 'text-[var(--text-muted)] opacity-50 hover:bg-[var(--hairline)]'
              }`}
            >
              {Number(date.slice(8))}
              {withEntries.has(date) && (
                <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[var(--accent)]'}`} />
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
