import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

const base =
  'rounded-[var(--radius-control)] bg-[var(--hairline)] px-4 py-2.5 text-[16px] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]'

export function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${base} ${className}`} {...props} />
}

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${base} ${className}`} {...props} />
}
