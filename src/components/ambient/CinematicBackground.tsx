// ─────────────────────────────────────────────
// CINEMATIC BACKGROUND
//
// Fixed full-viewport visual atmosphere that sits
// behind ALL content. Server Component — no JS.
//
// Layer stack (back → front):
//   1. Anchored radial washes — top-left amber +
//      bottom-right cool slate (consistent light source)
//   2. Dual SVG hairline grid — two slowly-drifting
//      layers at 56px and 112px pitch, opacity 0.022
//      and 0.014. Animated via CSS keyframes so no JS.
//   3. Cursor-following amber halo (consumes
//      --mouse-xp / --mouse-yp from AmbientCursor)
//   4. Top specular sweep + center vignette
// ─────────────────────────────────────────────

export function CinematicBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* ── Anchored radial washes ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 12% 0%, rgba(212,164,46,0.10), transparent 60%), ' +
            'radial-gradient(ellipse 50% 60% at 100% 100%, rgba(46,80,120,0.10), transparent 65%), ' +
            'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(8,8,10,0.85), transparent 70%)',
        }}
      />

      {/* ── Primary drifting grid (56px tile, 60s loop) ── */}
      <div
        className="absolute -inset-x-32 -inset-y-32 opacity-[0.022] motion-reduce:hidden"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-fg) 1px, transparent 1px), ' +
            'linear-gradient(to bottom, var(--color-fg) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          animation: 'grid-drift 60s linear infinite',
          willChange: 'transform',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 40%, #000 50%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 40%, #000 50%, transparent 100%)',
        }}
      />

      {/* ── Secondary larger grid (112px tile, 80s counter-drift) — adds parallax depth ── */}
      <div
        className="absolute -inset-x-32 -inset-y-32 opacity-[0.014] motion-reduce:hidden"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-fg) 1px, transparent 1px), ' +
            'linear-gradient(to bottom, var(--color-fg) 1px, transparent 1px)',
          backgroundSize: '112px 112px',
          animation: 'grid-drift-counter 80s linear infinite',
          willChange: 'transform',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)',
        }}
      />

      {/* ── Static grid fallback for reduced-motion users (no animation) ── */}
      <div
        className="absolute inset-0 opacity-[0.022] hidden motion-reduce:block"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-fg) 1px, transparent 1px), ' +
            'linear-gradient(to bottom, var(--color-fg) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 40%, #000 50%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 40%, #000 50%, transparent 100%)',
        }}
      />

      {/* ── Cursor-following amber halo ── */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle 600px at var(--mouse-xp, 50%) var(--mouse-yp, 30%), rgba(212,164,46,0.06), transparent 60%)',
        }}
      />

      {/* ── Secondary cool halo — counter-tone, smaller, tracks too ── */}
      <div
        className="absolute inset-0 transition-opacity duration-700 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle 320px at var(--mouse-xp, 50%) var(--mouse-yp, 50%), rgba(120,160,200,0.03), transparent 65%)',
        }}
      />

      {/* ── Top specular sweep ── */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 50%, transparent)',
        }}
      />

      {/* ── Center vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  )
}
