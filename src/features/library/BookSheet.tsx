import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Select, TextArea, TextInput } from '../../components/ui/Input'
import { Sheet } from '../../components/ui/Sheet'
import { StarRating } from '../../components/ui/StarRating'
import { todayKey } from '../../lib/dates'
import { moveBook, SHELVES } from '../../lib/library'
import { useStore } from '../../store/storeContext'
import type { Book, BookStatus } from '../../types/models'
import { BookCover } from './BookCover'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1 block text-sm text-[var(--text-muted)]">{label}</span>
    {children}
  </label>
)

/** Edit a book. Changes save instantly. */
export function BookSheet({ bookId, onClose }: { bookId: string; onClose: () => void }) {
  const { data, update } = useStore()
  const [confirming, setConfirming] = useState(false)
  const book = data.books.find((b) => b.id === bookId)
  if (!book) return null

  const patch = (p: Partial<Book>) => update((d) => ({ ...d, books: d.books.map((b) => (b.id === bookId ? { ...b, ...p } : b)) }))
  const date = (v: string) => v || undefined

  return (
    <Sheet label={`Edit ${book.title}`} onClose={onClose}>
      <div className="flex gap-4">
        <BookCover title={book.title} url={book.coverUrl} className="h-28 w-20 shrink-0" />
        <div className="min-w-0 flex-1 space-y-3">
          <Field label="Title"><TextInput value={book.title} onChange={(e) => patch({ title: e.target.value })} className="w-full" /></Field>
          <Field label="Author"><TextInput value={book.author} onChange={(e) => patch({ author: e.target.value })} className="w-full" /></Field>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <Field label="Shelf">
          <Select value={book.status} onChange={(e) => update((d) => ({ ...d, books: d.books.map((b) => (b.id === bookId ? moveBook(b, e.target.value as BookStatus, todayKey()) : b)) }))} className="w-full">
            {SHELVES.map((s) => <option key={s.status} value={s.status}>{s.title}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Started"><TextInput type="date" value={book.startedOn ?? ''} onChange={(e) => patch({ startedOn: date(e.target.value) })} className="w-full" /></Field>
          <Field label="Finished"><TextInput type="date" value={book.finishedOn ?? ''} onChange={(e) => patch({ finishedOn: date(e.target.value) })} className="w-full" /></Field>
        </div>
        <div>
          <span className="mb-1 block text-sm text-[var(--text-muted)]">Rating</span>
          <StarRating value={book.rating} onChange={(rating) => patch({ rating })} />
        </div>
        <Field label="Notes">
          <TextArea value={book.notes} onChange={(e) => patch({ notes: e.target.value })} placeholder="Thoughts, quotes, takeaways" className="min-h-28 w-full [field-sizing:content]" />
        </Field>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {confirming ? (
          <Button variant="secondary" onClick={() => { update((d) => ({ ...d, books: d.books.filter((b) => b.id !== bookId) })); onClose() }}>Tap to confirm delete</Button>
        ) : (
          <Button variant="ghost" onClick={() => setConfirming(true)}>Delete</Button>
        )}
        <Button onClick={onClose}>Done</Button>
      </div>
    </Sheet>
  )
}
