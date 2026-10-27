import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { TabBar } from '../../components/ui/TabBar'
import { setTheme, useTheme, type Theme } from '../../hooks/useTheme'
import { DataCard } from './DataCard'

const THEMES: Record<string, Theme> = { System: 'system', Light: 'light', Dark: 'dark' }

export function SettingsPage() {
  const { theme } = useTheme()
  const active = Object.keys(THEMES).find((k) => THEMES[k] === theme) ?? 'System'

  return (
    <>
      <h1 className="text-5xl font-semibold sm:text-6xl">Settings</h1>
      <div className="mt-10 space-y-6">
        <Card>
          <h2 className="text-2xl font-semibold">Appearance</h2>
          <p className="mb-4 mt-1 text-[var(--text-muted)]">System follows your device. This choice is saved on this device only.</p>
          <TabBar tabs={Object.keys(THEMES)} active={active} onChange={(k) => setTheme(THEMES[k])} />
        </Card>
        <DataCard />
        <p className="text-sm text-[var(--text-muted)]">
          <Link to="/design" className="underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Design system</Link>
        </p>
      </div>
    </>
  )
}
