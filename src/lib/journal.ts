import type { DateKey, JournalEntry } from '../types/models'

export interface JournalHit {
  date: DateKey
  snippet: string
}

const SNIPPET = 140

function snippetAround(text: string, index: number): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= SNIPPET) return flat
  const start = Math.max(0, Math.min(index - 40, flat.length - SNIPPET))
  return `${start > 0 ? '…' : ''}${flat.slice(start, start + SNIPPET)}${start + SNIPPET < flat.length ? '…' : ''}`
}

/** Case-insensitive substring search, newest first. An empty query lists every entry. */
export function searchJournal(journal: Record<DateKey, JournalEntry>, query: string): JournalHit[] {
  const q = query.trim().toLowerCase()
  return Object.entries(journal)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .flatMap(([date, entry]) => {
      const at = q ? entry.text.toLowerCase().indexOf(q) : 0
      return at === -1 ? [] : [{ date, snippet: snippetAround(entry.text, at) }]
    })
}
