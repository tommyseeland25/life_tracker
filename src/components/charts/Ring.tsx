import { motion, useReducedMotion } from 'framer-motion'

/** Progress ring (0-1) that sweeps in. Children render in the center. */
export function Ring({ progress, color, children }: { progress: number; color: string; children?: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--hairline)" strokeWidth="8" />
        <motion.circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ opacity: progress > 0 ? 1 : 0 }} // a 0-length round cap would still draw a dot
          initial={{ pathLength: reduce ? progress : 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm font-semibold">{children}</div>
    </div>
  )
}
