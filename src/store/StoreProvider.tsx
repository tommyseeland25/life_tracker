import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Storage } from '../lib/storage/Storage'
import { LocalStorageAdapter } from '../lib/storage/localStorageAdapter'
import type { AppData } from '../types/models'
import { StoreContext } from './storeContext'

export function StoreProvider({ children, storage }: { children: ReactNode; storage?: Storage }) {
  const adapter = useRef<Storage>(storage ?? new LocalStorageAdapter())
  const [data, setData] = useState<AppData | null>(null)
  const [error, setError] = useState<string | null>(null)
  // The latest data, readable synchronously. Lets us save in the same tick as the change,
  // so closing the tab right after an edit can't lose it.
  const latest = useRef<AppData | null>(null)

  useEffect(() => {
    adapter.current.load().then(
      (d) => {
        latest.current = d
        setData(d)
      },
      (e: Error) => setError(e.message),
    )
  }, [])

  const replace = useCallback((next: AppData) => {
    latest.current = next
    setData(next)
    void adapter.current.save(next)
  }, [])

  const update = useCallback(
    (fn: (d: AppData) => AppData) => {
      if (latest.current) replace(fn(latest.current))
    },
    [replace],
  )

  const value = useMemo(() => (data ? { data, update, replace } : null), [data, update, replace])

  if (error) return <p className="p-8">Could not load your data: {error}</p>
  // oxlint-disable-next-line react/refs -- false positive: update/replace read refs only when called, never during render
  if (!value) return null
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
