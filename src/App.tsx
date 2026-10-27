import { MotionConfig } from 'framer-motion'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, setTheme } = useTheme()
  const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'

  return (
    // reducedMotion="user" makes Framer Motion respect prefers-reduced-motion everywhere
    <MotionConfig reducedMotion="user">
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-5xl font-semibold">Life OS</h1>
        <p className="mt-3 text-[var(--text-muted)]">Phase 0 scaffold is running.</p>
        <button
          onClick={() => setTheme(next)}
          className="mt-8 rounded-[var(--radius-control)] bg-[var(--accent)] px-5 py-2.5 text-[var(--accent-contrast)]"
        >
          Theme: {theme} (click for {next})
        </button>
      </main>
    </MotionConfig>
  )
}
