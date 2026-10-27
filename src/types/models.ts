/** A local calendar date as 'YYYY-MM-DD'. Everything time-based is keyed by this. */
export type DateKey = string

export interface Area {
  id: string
  name: string
  /** Any CSS color; seeded areas use the --area-N tokens. */
  color: string
  order: number
  archived: boolean
  /** The pinned "current plan" note. */
  plan: string
}

export interface Habit {
  id: string
  areaId: string
  title: string
  order: number
  /** Archived habits leave Today but stay joinable so history/stats remain accurate. */
  archived: boolean
  createdAt: DateKey
}

export interface DailyTask {
  id: string
  date: DateKey
  text: string
  done: boolean
  order: number
}

export interface JournalEntry {
  text: string
  updatedAt: string // ISO timestamp
}

export interface AreaEntry {
  id: string
  areaId: string
  date: DateKey
  text: string
}

export interface AreaMetric {
  id: string
  areaId: string
  date: DateKey
  name: string // e.g. "Bodyweight"
  value: number
}

export type BookStatus = 'reading' | 'want' | 'read'

export interface Book {
  id: string
  title: string
  author: string
  status: BookStatus
  startedOn?: DateKey
  finishedOn?: DateKey
  rating?: number // 1-5
  notes: string
  coverUrl?: string
}

export interface Settings {
  theme: 'system' | 'light' | 'dark'
}

export interface AppData {
  /** Bump when the shape changes and add a step in migrate(). */
  version: number
  areas: Area[]
  habits: Habit[]
  /** date -> ids of habits checked that day. "Today has no key yet" == a fresh day. */
  checks: Record<DateKey, string[]>
  tasks: DailyTask[]
  journal: Record<DateKey, JournalEntry>
  areaEntries: AreaEntry[]
  areaMetrics: AreaMetric[]
  books: Book[]
  settings: Settings
}
