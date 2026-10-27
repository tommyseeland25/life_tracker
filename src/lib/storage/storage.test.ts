import { describe, expect, it } from 'vitest'
import { parseImport, serialize } from './exportImport'
import { LocalStorageAdapter } from './localStorageAdapter'
import { createSeedData } from './seed'

function fakeKV() {
  const m = new Map<string, string>()
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }
}

describe('export/import', () => {
  it('round-trips data', () => {
    const d = createSeedData()
    expect(parseImport(serialize(d))).toEqual(d)
  })
  it('rejects non-JSON, wrong shapes, and newer versions', () => {
    expect(() => parseImport('nope')).toThrow(/valid JSON/)
    expect(() => parseImport('[]')).toThrow()
    expect(() => parseImport('{"version":1}')).toThrow(/areas/)
    expect(() => parseImport(JSON.stringify({ ...createSeedData(), version: 99 }))).toThrow(/newer/)
  })
})

describe('LocalStorageAdapter', () => {
  it('seeds on first load, then returns what was saved', async () => {
    const a = new LocalStorageAdapter(fakeKV())
    const first = await a.load()
    expect(first.areas).toHaveLength(8)
    await a.save({ ...first, habits: [{ id: 'h', areaId: first.areas[0].id, title: 'Stretch', order: 0, archived: false, createdAt: '2026-01-01' }] })
    expect((await a.load()).habits).toHaveLength(1)
  })
})
