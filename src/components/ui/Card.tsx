import { motion, type HTMLMotionProps } from 'framer-motion'

/** Frosted-glass surface that rises in on mount. */
export function Card({ className = '', ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className={`rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] backdrop-blur-xl backdrop-saturate-150 ${className}`}
      {...props}
    />
  )
}
