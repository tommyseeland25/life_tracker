import { useState } from 'react'
import { todayKey } from '../../lib/dates'
import { moveBook, SHELVES, shelfBooks } from '../../lib/library'
import { useStore } from '../../store/storeContext'
import { AddBook } from './AddBook'
import { BookCard } from './BookCard'
import { BookSheet } from './BookSheet'

export function LibraryPage() {
  const { data, update } = useStore()
  const [openId, setOpenId] = useState<string | null>(null)

  const move = (id: string, to: Parameters<typeof moveBook>[1]) =>
    update((d) => ({ ...d, books: d.books.map((b) => (b.id === id ? moveBook(b, to, todayKey()) : b)) }))

  return (
    <>
      <h1 className="text-5xl font-semibold sm:text-6xl">Library</h1>
      <div className="mt-10 space-y-10">
        <AddBook />
        {SHELVES.map((s) => {
          const books = shelfBooks(data.books, s.status)
          return (
            <section key={s.status} aria-labelledby={`shelf-${s.status}`}>
              <h2 id={`shelf-${s.status}`} className="mb-4 flex items-baseline gap-2 text-2xl font-semibold">
                {s.title} <span className="text-base font-normal text-[var(--text-muted)]">{books.length}</span>
              </h2>
              {books.length === 0 ? (
                <p className="text-[var(--text-muted)]">{s.empty}</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {books.map((b) => <BookCard key={b.id} book={b} onOpen={() => setOpenId(b.id)} onMove={(to) => move(b.id, to)} />)}
                </div>
              )}
            </section>
          )
        })}
      </div>
      {openId && <BookSheet bookId={openId} onClose={() => setOpenId(null)} />}
    </>
  )
}
