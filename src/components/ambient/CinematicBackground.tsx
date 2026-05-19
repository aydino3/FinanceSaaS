// ─────────────────────────────────────────────
// CINEMATIC BACKGROUND
//
// Fixed full-viewport visual atmosphere that sits
// behind ALL content. Server Component — no JS.
//
// Layer stack (back → front):
//   1. Deep canvas color   (body bg, already set)
//   2. Two anchored radial washes (top-left amber,
//      bottom-right cool slate) — establish a
//      consistent light source
//   3. SVG hairline grid at opacity 0.03 — gives
//      the abyss perceptible scale
//   4. Cursor-following soft amber halo, driven
//      by --mouse-xp / --mouse-yp (from AmbientCursor)
//   5. Vignette — pulls focus toward center
//
// All layers are pointer-events-none and fixed.
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

      {/* ── SVG hairline grid ── */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="cinematic-grid"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 56 0 L 0 0 0 56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-[var(--color-fg)]"
            />
          </pattern>
          {/* Mask fades the grid out at the edges */}
          <radialGradient id="cinematic-grid-mask" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="cinematic-grid-mask-layer">
            <rect width="100%" height="100%" fill="url(#cinematic-grid-mask)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#cinematic-grid)"
          mask="url(#cinematic-grid-mask-layer)"
        />
      </svg>

      {/* ── Cursor-following amber halo (consumes --mouse-xp/yp) ── */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle 600px at var(--mouse-xp, 50%) var(--mouse-yp, 30%), rgba(212,164,46,0.06), transparent 60%)',
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
