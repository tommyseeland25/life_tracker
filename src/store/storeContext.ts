import { createContext, useContext } from 'react'
import type { AppData } from '../types/models'

export interface StoreValue {
  data: AppData
  /** Apply an immutable update, e.g. update(d => ({ ...d, books: [...d.books, book] })). */
  update: (fn: (d: AppData) => AppData) => void
  /** Replace everything (used by import). */
  replace: (d: AppData) => void
}

export const StoreContext = createContext<StoreValue | null>(null)

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
