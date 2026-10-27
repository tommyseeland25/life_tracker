import type { AppData } from '../../types/models'

/**
 * The only thing the app knows about persistence. Async on purpose: a future
 * Supabase adapter implements the same two methods and nothing else changes.
 */
export interface Storage {
  load(): Promise<AppData>
  save(data: AppData): Promise<void>
}
