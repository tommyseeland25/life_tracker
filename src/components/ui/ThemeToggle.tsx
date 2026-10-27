import { useTheme, type Theme } from '../../hooks/useTheme'

const order: Theme[] = ['system', 'light', 'dark']
const icons: Record<Theme, string> = {
  system: 'M4 5h16v11H4zM9 20h6M12 16v4',
  light: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  dark: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const next = order[(order.indexOf(theme) + 1) % order.length]
  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${theme}. Switch to ${next}`}
      className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-[var(--text-muted)] outline-none hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d={icons[theme]} />
      </svg>
    </button>
  )
}
