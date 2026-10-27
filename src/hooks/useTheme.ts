import { useSyncExternalStore } from 'react'

export type Theme = 'system' | 'light' | 'dark'
const KEY = 'lifeos.theme'

function read(): Theme {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* storage unavailable: fall back to system */
  }
  return 'system'
}

/** One shared theme for the whole app (a module-level store), so every component stays in sync. */
let current: Theme = read()
const listeners = new Set<() => void>()

/** 'system' removes data-theme so the prefers-color-scheme media query in tokens.css applies. */
function applyToDom(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}
applyToDom(current)

export function setTheme(theme: Theme) {
  current = theme
  applyToDom(theme)
  try {
    if (theme === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, theme)
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
  )
  return { theme, setTheme }
}
