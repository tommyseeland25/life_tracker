import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { StarRating } from '../../components/ui/StarRating'
import { formatShort } from '../../lib/dates'
import type { Book, BookStatus } from '../../types/models'
import { BookCover } from './BookCover'

const QUICK: Record<BookStatus, { label: string; to: BookStatus }> = {
  want: { label: 'Start reading', to: 'reading' },
  reading: { label: 'Mark finished', to: 'read' },
  read: { label: 'Read again', to: 'reading' },
}

export function BookCard({ book, onOpen, onMove }: { book: Book; onOpen: () => void; onMove: (to: BookStatus) => void }) {
  const quick = QUICK[book.status]
  const date = book.status === 'read' ? book.finishedOn : book.startedOn
  return (
    <Card whileHover={{ y: -3 }} className="flex flex-col gap-3 !p-4">
      <button onClick={onOpen} className="flex gap-3 rounded-[var(--radius-control)] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
        <BookCover title={book.title} url={book.coverUrl} className="h-24 w-16 shrink-0" />
        <span className="min-w-0">
          <span className="line-clamp-2 block font-semibold leading-snug">{book.title}</span>
          {book.author && <span className="block truncate text-sm text-[var(--text-muted)]">{book.author}</span>}
          {date && <span className="mt-1 block text-xs text-[var(--text-muted)]">{book.status === 'read' ? 'Finished' : 'Started'} {formatShort(date)}</span>}
          {book.rating && <span className="mt-1 block"><StarRating value={book.rating} /></span>}
        </span>
      </button>
      <Button variant="secondary" className="!py-1.5 !text-sm" onClick={() => onMove(quick.to)}>{quick.label}</Button>
    </Card>
  )
}
