import { motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Modal sheet on the native <dialog> element: focus trapping, Escape to close,
 * and a blurred backdrop come from the browser. Bottom sheet on phones, centered card on desktop.
 */
export function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      // Content has its own padding, so a click whose target is the <dialog> itself hit the backdrop.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto mb-0 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-[var(--surface-solid)] p-0 text-[var(--text)] shadow-[var(--shadow-card)] backdrop:bg-black/30 backdrop:backdrop-blur-sm sm:mb-auto sm:rounded-[28px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="p-6"
      >
        {children}
      </motion.div>
    </dialog>
  )
}
