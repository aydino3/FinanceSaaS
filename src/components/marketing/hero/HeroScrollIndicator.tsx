// ─────────────────────────────────────────────
// HERO SCROLL INDICATOR
//
// CSS-only animated scroll prompt. No JavaScript,
// no Framer Motion — pure CSS keyframes.
// Rendered as a Server Component.
// ─────────────────────────────────────────────

export function HeroScrollIndicator() {
  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2
                 flex flex-col items-center gap-1.5"
      aria-hidden="true"
    >
      {/* Animated scroll container */}
      <div
        className="flex h-8 w-5 items-start justify-center rounded-full
                   border border-white/[0.10] p-1"
      >
        {/* The moving dot inside the scroll wheel */}
        <div
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-fg-subtle)]"
          style={{ animation: 'var(--animate-scroll-bounce)' }}
        />
      </div>

      {/* Label */}
      <span
        className="type-label-sm text-[var(--color-fg-disabled)]"
        style={{
          animation: 'var(--animate-scroll-bounce)',
          animationDelay: '0.15s',
        }}
      >
        Kaydır
      </span>
    </div>
  )
}
