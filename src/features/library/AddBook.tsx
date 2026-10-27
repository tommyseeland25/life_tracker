import { useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select, TextInput } from '../../components/ui/Input'
import { SHELVES } from '../../lib/library'
import { searchBooks, type BookResult } from '../../lib/openLibrary'
import { todayKey } from '../../lib/dates'
import { useStore } from '../../store/storeContext'
import type { BookStatus } from '../../types/models'
import { BookCover } from './BookCover'

/** Search Open Library (no key needed) or add by hand if offline / not found. */
export function AddBook() {
  const { update } = useStore()
  const [q, setQ] = useState('')
  const [shelf, setShelf] = useState<BookStatus>('want')
  const [results, setResults] = useState<BookResult[] | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const abort = useRef<AbortController | null>(null)

  const add = (r: BookResult) => {
    const today = todayKey()
    update((d) => ({
      ...d,
      books: [...d.books, {
        id: crypto.randomUUID(), title: r.title, author: r.author, status: shelf, notes: '', coverUrl: r.coverUrl,
        startedOn: shelf === 'reading' || shelf === 'read' ? today : undefined,
        finishedOn: shelf === 'read' ? today : undefined,
      }],
    }))
  }

  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    abort.current?.abort()
    abort.current = new AbortController()
    setState('loading')
    try {
      setResults(await searchBooks(q.trim(), abort.current.signal))
      setState('idle')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setState('error')
    }
  }

  return (
    <Card>
      <form onSubmit={search} className="flex flex-wrap gap-2">
        <TextInput type="search" aria-label="Search books" placeholder="Search by title or author" value={q} onChange={(e) => setQ(e.target.value)} className="min-w-0 flex-1 basis-56" />
        <Select aria-label="Add to shelf" value={shelf} onChange={(e) => setShelf(e.target.value as BookStatus)}>
          {SHELVES.map((s) => <option key={s.status} value={s.status}>{s.title}</option>)}
        </Select>
        <Button type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Searching…' : 'Search'}</Button>
      </form>

      {state === 'error' && <p role="alert" className="mt-3 text-sm text-[var(--text-muted)]">Couldn't reach Open Library. You can still add it by hand below.</p>}

      {(results || state === 'error') && (
        <ul className="mt-4 divide-y divide-[var(--hairline)]">
          {results?.map((r, i) => (
            <li key={i} className="flex items-center gap-3 py-2.5">
              <BookCover title={r.title} url={r.coverUrl} className="h-14 w-10 shrink-0 !rounded-md" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{r.title}</span>
                <span className="block truncate text-sm text-[var(--text-muted)]">{r.author}</span>
              </span>
              <Button variant="secondary" className="!py-1.5" aria-label={`Add ${r.title}`} onClick={() => add(r)}>Add</Button>
            </li>
          ))}
          {results?.length === 0 && <li className="py-3 text-[var(--text-muted)]">No results.</li>}
          <li className="py-3">
            <Button variant="ghost" onClick={() => add({ title: q.trim(), author: '' })}>Add “{q.trim()}” by hand</Button>
          </li>
        </ul>
      )}
    </Card>
  )
}
