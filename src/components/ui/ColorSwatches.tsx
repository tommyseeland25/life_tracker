const PALETTE = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `var(--area-${n})`)

export function ColorSwatches({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div role="radiogroup" aria-label="Color" className="flex gap-1.5">
      {PALETTE.map((c, i) => (
        <button
          key={c}
          role="radio"
          aria-checked={value === c}
          aria-label={`Color ${i + 1}`}
          onClick={() => onChange(c)}
          style={{ background: c }}
          className={`h-6 w-6 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${value === c ? 'ring-2 ring-[var(--text)] ring-offset-2 ring-offset-[var(--surface-solid)]' : ''}`}
        />
      ))}
    </div>
  )
}
