import { useEffect, useRef, useState } from 'react'

export type SaveStatus = 'saved' | 'saving'

/**
 * Debounced autosave. `onSave` fires `delay` ms after the last change, and
 * immediately on unmount (switching days, leaving the tab) so nothing typed is lost.
 */
export function useAutosave(value: string, onSave: (v: string) => void, delay = 500): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('saved')
  const saved = useRef(value) // last value handed to onSave
  const latest = useRef(value)
  const save = useRef(onSave)
  // Keep refs current after each render (declared first so it runs before the effects below).
  useEffect(() => {
    latest.current = value
    save.current = onSave
  })

  useEffect(() => {
    if (value === saved.current) return
    setStatus('saving')
    const t = setTimeout(() => {
      saved.current = value
      save.current(value)
      setStatus('saved')
    }, delay)
    return () => clearTimeout(t)
  }, [value, delay])

  // Flush on unmount.
  useEffect(
    () => () => {
      if (latest.current !== saved.current) save.current(latest.current)
    },
    [],
  )

  return status
}
