import { motion } from 'framer-motion'
import { useId } from 'react'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  /** Fill color when checked; defaults to the accent. Used for per-area colors. */
  color?: string
}

/** Real <input> (keyboard + screen reader support) with a custom animated box on top. */
export function Checkbox({ checked, onChange, label, color = 'var(--accent)' }: Props) {
  const id = useId()
  return (
    <label htmlFor={id} className="group flex cursor-pointer items-center gap-3 py-1.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <motion.span
        animate={{ scale: checked ? [1, 1.18, 1] : 1, backgroundColor: checked ? color : 'transparent' }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        style={{ boxShadow: checked ? 'none' : 'inset 0 0 0 1.5px var(--text-muted)' }}
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--bg)]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={color === 'var(--accent)' ? 'white' : '#1d1d1f'} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          />
        </svg>
      </motion.span>
      <span
        className={`text-[17px] transition-colors ${checked ? 'text-[var(--text-muted)] line-through decoration-1' : ''}`}
      >
        {label}
      </span>
    </label>
  )
}
