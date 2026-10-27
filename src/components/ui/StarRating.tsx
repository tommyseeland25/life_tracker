/** 1-5 stars. Tapping the current rating clears it. `readOnly` renders a compact display. */
export function StarRating({ value = 0, onChange }: { value?: number; onChange?: (v: number | undefined) => void }) {
  return (
    <div role={onChange ? 'radiogroup' : 'img'} aria-label={onChange ? 'Rating' : `Rated ${value} of 5`} className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill={n <= value ? 'var(--area-5)' : 'none'} stroke={n <= value ? 'var(--area-5)' : 'var(--text-muted)'} strokeWidth={1.6} strokeLinejoin="round">
            <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z" />
          </svg>
        )
        return onChange ? (
          <button
            key={n}
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onChange(n === value ? undefined : n)}
            className="rounded outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        )
      })}
    </div>
  )
}
