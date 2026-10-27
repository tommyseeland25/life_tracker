import { useDeferredValue, useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { addMonths, startOfMonth } from '../../lib/calendar'
import { addDays, todayKey } from '../../lib/dates'
import { searchJournal } from '../../lib/journal'
import { useStore } from '../../store/storeContext'
import { EntryList } from './EntryList'
import { JournalEditor } from './JournalEditor'
import { MonthCalendar } from './MonthCalendar'

export function JournalPage() {
  const { data } = useStore()
  const [date, setDate] = useState(todayKey)
  const [month, setMonth] = useState(() => startOfMonth(todayKey()))
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)

  const hits = useMemo(() => searchJournal(data.journal, deferred), [data.journal, deferred])
  const withEntries = useMemo(() => new Set(Object.keys(data.journal)), [data.journal])

  const go = (d: string) => {
    setDate(d)
    setMonth(startOfMonth(d))
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-5xl font-semibold sm:text-6xl">Journal</h1>
        <div className="flex items-center gap-1">
          <Button variant="ghost" aria-label="Previous day" onClick={() => go(addDays(date, -1))}>‹</Button>
          <Button variant="secondary" disabled={date === todayKey()} onClick={() => go(todayKey())}>Today</Button>
          <Button variant="ghost" aria-label="Next day" onClick={() => go(addDays(date, 1))}>›</Button>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <JournalEditor key={date} date={date} />
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthCalendar month={month} selected={date} withEntries={withEntries} onSelect={go} onMonth={(n) => setMonth(addMonths(month, n))} />
          <EntryList hits={hits} query={query} onQuery={setQuery} selected={date} onSelect={go} />
        </div>
      </div>
    </>
  )
}
