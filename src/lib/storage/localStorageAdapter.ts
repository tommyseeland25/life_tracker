import type { AppData } from '../../types/models'
import { parseImport, serialize } from './exportImport'
import { createSeedData } from './seed'
import type { Storage } from './Storage'

const KEY = 'lifeos.data'

/** The subset of window.localStorage we use, so tests can pass a fake. */
type KV = Pick<globalThis.Storage, 'getItem' | 'setItem'>

export class LocalStorageAdapter implements Storage {
  private kv: KV

  constructor(kv: KV = localStorage) {
    this.kv = kv
  }

  async load(): Promise<AppData> {
    const text = this.kv.getItem(KEY)
    if (!text) {
      const seed = createSeedData()
      await this.save(seed)
      return seed
    }
    // Reuse the import validator so a corrupted blob fails loudly instead of crashing pages later.
    return parseImport(text)
  }

  async save(data: AppData): Promise<void> {
    this.kv.setItem(KEY, serialize(data))
  }
}
