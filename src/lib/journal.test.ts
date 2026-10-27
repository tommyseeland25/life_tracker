import { describe, expect, it } from 'vitest'
import { searchJournal } from './journal'

const e = (text: string) => ({ text, updatedAt: '' })
const journal = {
  '2026-10-01': e('Squatted heavy. Knee felt fine.'),
  '2026-10-03': e('Read about BJJ guard passing'),
  '2026-10-02': e('Rest day, KNEE sore'),
}

describe('searchJournal', () => {
  it('lists everything newest first for an empty query', () => {
    expect(searchJournal(journal, '  ').map((h) => h.date)).toEqual(['2026-10-03', '2026-10-02', '2026-10-01'])
  })
  it('matches case-insensitively', () => {
    expect(searchJournal(journal, 'knee').map((h) => h.date)).toEqual(['2026-10-02', '2026-10-01'])
  })
  it('returns nothing when there is no match', () => {
    expect(searchJournal(journal, 'zzz')).toEqual([])
  })
  it('centers long entries around the match with ellipses', () => {
    const long = { d: e(`${'a '.repeat(100)}needle${' b'.repeat(100)}`) }
    const [hit] = searchJournal(long, 'needle')
    expect(hit.snippet).toContain('needle')
    expect(hit.snippet.startsWith('…')).toBe(true)
    expect(hit.snippet.endsWith('…')).toBe(true)
  })
})
