import { describe, expect, it } from 'vitest'
import { parseSearchResponse } from './openLibrary'

describe('parseSearchResponse', () => {
  it('extracts title, first author and cover url', () => {
    expect(parseSearchResponse({ docs: [{ title: 'Dune', author_name: ['Frank Herbert', 'x'], cover_i: 123 }] })).toEqual([
      { title: 'Dune', author: 'Frank Herbert', coverUrl: 'https://covers.openlibrary.org/b/id/123-M.jpg' },
    ])
  })
  it('tolerates missing author/cover and skips untitled docs', () => {
    const out = parseSearchResponse({ docs: [{ title: 'No extras' }, { author_name: ['x'] }, null] })
    expect(out).toEqual([{ title: 'No extras', author: '', coverUrl: undefined }])
  })
  it('returns [] for junk', () => {
    expect(parseSearchResponse(null)).toEqual([])
    expect(parseSearchResponse({ docs: 'no' })).toEqual([])
  })
})
