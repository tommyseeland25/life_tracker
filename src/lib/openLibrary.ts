export interface BookResult {
  title: string
  author: string
  coverUrl?: string
}

/** Turn an Open Library search.json response into the few fields we use. Tolerates missing data. */
export function parseSearchResponse(json: unknown): BookResult[] {
  const docs = (json as { docs?: unknown })?.docs
  if (!Array.isArray(docs)) return []
  return docs.flatMap((d: { title?: unknown; author_name?: unknown; cover_i?: unknown }) => {
    if (typeof d?.title !== 'string') return []
    return [{
      title: d.title,
      author: Array.isArray(d.author_name) && typeof d.author_name[0] === 'string' ? d.author_name[0] : '',
      coverUrl: typeof d.cover_i === 'number' ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : undefined,
    }]
  })
}

/** Open Library needs no API key. */
export async function searchBooks(query: string, signal?: AbortSignal): Promise<BookResult[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8&fields=title,author_name,cover_i`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Open Library returned ${res.status}`)
  return parseSearchResponse(await res.json())
}
