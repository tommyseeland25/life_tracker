import { motion } from 'framer-motion'
import { useId, useRef } from 'react'

interface Props {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

/** Segmented pill control. The highlight slides between tabs via a shared layoutId. */
export function TabBar({ tabs, active, onChange }: Props) {
  const group = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  // Arrow keys move between tabs (standard tablist behavior).
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (i + dir + tabs.length) % tabs.length
    onChange(tabs[next])
    refs.current[next]?.focus()
  }

  return (
    <div role="tablist" className="relative flex gap-1 rounded-full bg-[var(--hairline)] p-1">
      {tabs.map((tab, i) => {
        const isActive = tab === active
        return (
          <button
            key={tab}
            ref={(el) => { refs.current[i] = el }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="relative rounded-full px-2.5 py-1.5 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:px-4 sm:text-[14px]"
          >
            {isActive && (
              <motion.span
                layoutId={`pill-${group}`}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-[var(--surface-solid)] shadow-[0_1px_3px_rgb(0_0_0/0.15)]"
              />
            )}
            <span className={`relative ${isActive ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{tab}</span>
          </button>
        )
      })}
    </div>
  )
}
