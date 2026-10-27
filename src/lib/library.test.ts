import { describe, expect, it } from 'vitest'
import type { Book } from '../types/models'
import { moveBook, shelfBooks } from './library'

const book = (id: string, o: Partial<Book> = {}): Book => ({ id, title: id, author: '', status: 'want', notes: '', ...o })
const T = '2026-10-27'

describe('moveBook', () => {
  it('want -> reading stamps the start date', () => {
    expect(moveBook(book('a'), 'reading', T)).toMatchObject({ status: 'reading', startedOn: T, finishedOn: undefined })
  })
  it('reading -> read keeps the start date and stamps the finish date', () => {
    const b = book('a', { status: 'reading', startedOn: '2026-10-01' })
    expect(moveBook(b, 'read', T)).toMatchObject({ status: 'read', startedOn: '2026-10-01', finishedOn: T })
  })
  it('want -> read leaves the start date empty', () => {
    const moved = moveBook(book('a'), 'read', T)
    expect(moved.startedOn).toBeUndefined()
    expect(moved.finishedOn).toBe(T)
  })
  it('read -> reading starts a fresh read today', () => {
    const b = book('a', { status: 'read', startedOn: '2026-01-01', finishedOn: '2026-02-01' })
    expect(moveBook(b, 'reading', T)).toMatchObject({ startedOn: T, finishedOn: undefined })
  })
  it('anything -> want clears dates; same shelf is a no-op', () => {
    const b = book('a', { status: 'read', startedOn: '2026-01-01', finishedOn: '2026-02-01' })
    expect(moveBook(b, 'want', T)).toMatchObject({ startedOn: undefined, finishedOn: undefined })
    expect(moveBook(b, 'read', T)).toBe(b)
  })
})

describe('shelfBooks', () => {
  it('filters by shelf and orders each sensibly', () => {
    const books = [
      book('w1'), book('w2'),
      book('r-old', { status: 'read', finishedOn: '2026-01-01' }),
      book('r-new', { status: 'read', finishedOn: '2026-06-01' }),
      book('cur', { status: 'reading', startedOn: '2026-10-01' }),
    ]
    expect(shelfBooks(books, 'want').map((b) => b.id)).toEqual(['w2', 'w1'])
    expect(shelfBooks(books, 'read').map((b) => b.id)).toEqual(['r-new', 'r-old'])
    expect(shelfBooks(books, 'reading').map((b) => b.id)).toEqual(['cur'])
  })
})
