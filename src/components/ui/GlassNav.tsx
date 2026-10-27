import { TabBar } from './TabBar'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

/** Floating frosted pill: top-center on desktop, bottom-center (thumb reach) on phones. */
export function GlassNav(props: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3 sm:bottom-auto sm:top-4">
      <div className="flex items-center gap-0.5 rounded-full bg-[var(--surface)] p-1 sm:gap-1 sm:p-1.5 shadow-[var(--shadow-card)] backdrop-blur-xl backdrop-saturate-150">
        <TabBar {...props} />
        <ThemeToggle />
      </div>
    </nav>
  )
}
