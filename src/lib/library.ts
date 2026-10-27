import type { Book, BookStatus, DateKey } from '../types/models'

export const SHELVES: { status: BookStatus; title: string; empty: string }[] = [
  { status: 'reading', title: 'Currently Reading', empty: 'Nothing on the go. Start something from your want-to-read list.' },
  { status: 'want', title: 'Want to Read', empty: 'Your reading list is empty. Search for a book above.' },
  { status: 'read', title: 'Read', empty: 'Finished books will collect here.' },
]

/**
 * Move a book to another shelf and keep its dates sensible:
 *  - want:    never started, so both dates clear
 *  - reading: start date is set (or kept); finish date clears. Re-reading a
 *             finished book starts a fresh read today.
 *  - read:    finish date is set (or kept); the start date is kept if known
 * Dates stay editable afterwards in the book sheet.
 */
export function moveBook(book: Book, status: BookStatus, today: DateKey): Book {
  if (status === book.status) return book
  switch (status) {
    case 'want':
      return { ...book, status, startedOn: undefined, finishedOn: undefined }
    case 'reading':
      return { ...book, status, startedOn: book.status === 'read' ? today : (book.startedOn ?? today), finishedOn: undefined }
    case 'read':
      return { ...book, status, finishedOn: book.finishedOn ?? today }
  }
}

/** Books on one shelf: reading by start date, read by finish date (newest first), want newest-added first. */
export function shelfBooks(books: Book[], status: BookStatus): Book[] {
  const dateOf = (b: Book) => (status === 'reading' ? b.startedOn : b.finishedOn) ?? ''
  return books
    .map((book, index) => ({ book, index }))
    .filter(({ book }) => book.status === status)
    .sort((a, b) => {
      if (status === 'want') return b.index - a.index
      const [x, y] = [dateOf(a.book), dateOf(b.book)]
      return x === y ? b.index - a.index : x < y ? 1 : -1
    })
    .map(({ book }) => book)
}
