import type { AppData } from '../../types/models'
import { CURRENT_VERSION } from './seed'

export function serialize(data: AppData): string {
  return JSON.stringify(data, null, 2)
}

/** Upgrade older exports step by step. Add `if (v < 2) {...}` blocks as the model evolves. */
export function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  const version = typeof raw.version === 'number' ? raw.version : 1
  if (version > CURRENT_VERSION) {
    throw new Error(`Data is from a newer version (${version}); update the app first.`)
  }
  return { ...raw, version: CURRENT_VERSION }
}

const ARRAY_KEYS = ['areas', 'habits', 'tasks', 'areaEntries', 'areaMetrics', 'books'] as const
const RECORD_KEYS = ['checks', 'journal'] as const

/** Parse + validate imported JSON. Throws a readable Error rather than loading bad data. */
export function parseImport(text: string): AppData {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('That file is not valid JSON.')
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('Expected a Life OS export object.')
  }
  const obj = migrate(raw as Record<string, unknown>)
  for (const k of ARRAY_KEYS) {
    if (!Array.isArray(obj[k])) throw new Error(`Missing or invalid "${k}".`)
  }
  for (const k of RECORD_KEYS) {
    const v = obj[k]
    if (typeof v !== 'object' || v === null || Array.isArray(v)) {
      throw new Error(`Missing or invalid "${k}".`)
    }
  }
  if (typeof obj.settings !== 'object' || obj.settings === null) {
    throw new Error('Missing or invalid "settings".')
  }
  return obj as unknown as AppData
}

/** Browser-only helpers (trigger a download / read a picked file). */
export function downloadJson(data: AppData, filename = `life-os-${new Date().toISOString().slice(0, 10)}.json`) {
  const url = URL.createObjectURL(new Blob([serialize(data)], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const readFileText = (file: File) => file.text()
