import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { GlassNav } from './ui/GlassNav'

const TABS = [
  { label: 'Today', path: '/' },
  { label: 'Journal', path: '/journal' },
  { label: 'Insights', path: '/insights' },
  { label: 'Areas', path: '/areas' },
  { label: 'Library', path: '/library' },
]

const gear =
  'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z'

export function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const tab = TABS.find((t) => (t.path === '/' ? pathname === '/' : pathname.startsWith(t.path)))
  const onSettings = pathname === '/settings'

  useEffect(() => {
    document.title = `${tab?.label ?? (onSettings ? 'Settings' : 'Life OS')} · Life OS`
  }, [tab, onSettings])

  return (
    <>
      <GlassNav
        tabs={TABS.map((t) => t.label)}
        active={tab?.label ?? ''}
        onChange={(label) => navigate(TABS.find((t) => t.label === label)!.path)}
        trailing={
          <Link
            to="/settings"
            aria-label="Settings"
            aria-current={onSettings ? 'page' : undefined}
            className={`grid h-8 w-8 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-9 sm:w-9 ${onSettings ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d={gear} />
            </svg>
          </Link>
        }
      />
      <main className="mx-auto max-w-4xl px-5 pb-32 pt-12 sm:pt-28">
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  )
}
