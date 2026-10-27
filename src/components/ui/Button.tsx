import { motion, type HTMLMotionProps } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost'

const styles: Record<Variant, string> = {
  primary: 'bg-[var(--accent)] text-[var(--accent-contrast)]',
  secondary: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  ghost: 'text-[var(--text-muted)] hover:text-[var(--text)]',
}

interface Props extends HTMLMotionProps<'button'> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`rounded-[var(--radius-control)] px-5 py-2.5 text-[15px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-40 ${styles[variant]} ${className}`}
      {...props}
    />
  )
}
