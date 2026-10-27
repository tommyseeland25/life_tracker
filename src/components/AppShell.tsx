import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { GlassNav } from './ui/GlassNav'

const TABS = [
  { label: 'Today', path: '/' },
  { label: 'Journal', path: '/journal' },
  { label: 'Insights', path: '/insights' },
  { label: 'Areas', path: '/areas' },
  { label: 'Library', path: '/library' },
]

export function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active = TABS.find((t) => (t.path === '/' ? pathname === '/' : pathname.startsWith(t.path)))?.label ?? ''

  return (
    <>
      <GlassNav
        tabs={TABS.map((t) => t.label)}
        active={active}
        onChange={(label) => navigate(TABS.find((t) => t.label === label)!.path)}
      />
      <main className="mx-auto max-w-4xl px-5 pb-32 pt-12 sm:pt-28">
        <Outlet />
      </main>
    </>
  )
}
