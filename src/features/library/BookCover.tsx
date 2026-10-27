/** Cover image, or a soft placeholder with the title's initial. */
export function BookCover({ title, url, className = '' }: { title: string; url?: string; className?: string }) {
  return url ? (
    <img src={url} alt="" loading="lazy" className={`rounded-xl object-cover shadow-md ${className}`} />
  ) : (
    <div aria-hidden className={`grid place-items-center rounded-xl bg-[var(--accent-soft)] text-2xl font-semibold text-[var(--accent)] ${className}`}>
      {title.trim().charAt(0).toUpperCase() || '?'}
    </div>
  )
}
