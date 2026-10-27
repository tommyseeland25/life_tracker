import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Storage } from '../lib/storage/Storage'
import { LocalStorageAdapter } from '../lib/storage/localStorageAdapter'
import type { AppData } from '../types/models'
import { StoreContext } from './storeContext'

export function StoreProvider({ children, storage }: { children: ReactNode; storage?: Storage }) {
  const adapter = useRef<Storage>(storage ?? new LocalStorageAdapter())
  const [data, setData] = useState<AppData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const loaded = useRef(false)

  useEffect(() => {
    adapter.current.load().then(
      (d) => {
        loaded.current = true
        setData(d)
      },
      (e: Error) => setError(e.message),
    )
  }, [])

  // Persist after every change, but never before the first load (would overwrite saved data).
  useEffect(() => {
    if (data && loaded.current) void adapter.current.save(data)
  }, [data])

  const update = useCallback((fn: (d: AppData) => AppData) => setData((d) => (d ? fn(d) : d)), [])
  const replace = useCallback((d: AppData) => setData(d), [])
  const value = useMemo(() => (data ? { data, update, replace } : null), [data, update, replace])

  if (error) return <p className="p-8">Could not load your data: {error}</p>
  if (!value) return null
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
