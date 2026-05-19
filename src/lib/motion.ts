import type { Variants, Transition } from 'framer-motion'

// ─────────────────────────────────────────────
// EASING CURVES
// Named exactly as defined in DESIGN_SYSTEM.md.
// Use these in all Framer Motion transition objects.
// ─────────────────────────────────────────────

export const easings = {
  /** Primary easing for entering UI elements — fast then decelerate */
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  /** For dismissals and exits — accelerate as element leaves */
  easeInExpo: [0.7, 0, 0.84, 0] as const,
  /** For position changes within a scene */
  easeInOutExpo: [0.87, 0, 0.13, 1] as const,
  /** Softer version of easeOutExpo — text reveals, subtle transitions */
  easeOutCirc: [0, 0.55, 0.45, 1] as const,
} as const

// ─────────────────────────────────────────────
// DURATION VALUES (in seconds, for Framer Motion)
// ─────────────────────────────────────────────

export const durations = {
  instant:     0,
  micro:       0.08,
  fast:        0.15,
  standard:    0.25,
  comfortable: 0.35,
  deliberate:  0.50,
  expressive:  0.70,
} as const

// ─────────────────────────────────────────────
// SPRING PRESETS
// Only for direct manipulation — drag, drop, swipe.
// Never for standard navigation transitions.
// ─────────────────────────────────────────────

export const springs = {
  /** Standard interactive spring — button taps, drag feedback */
  standard: { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const,
  /** Soft spring — panel mounts, bottom sheets */
  soft: { type: 'spring', stiffness: 200, damping: 28, mass: 1 } as const,
  /** Snappy spring — direct manipulation responses */
  snappy: { type: 'spring', stiffness: 400, damping: 40, mass: 1 } as const,
} as const

// ─────────────────────────────────────────────
// TRANSITION PRESETS
// Reusable Framer Motion `transition` objects.
// ─────────────────────────────────────────────

export const transitions = {
  enter: {
    duration: durations.comfortable,
    ease: easings.easeOutExpo,
  } satisfies Transition,

  exit: {
    duration: durations.fast,
    ease: easings.easeInExpo,
  } satisfies Transition,

  standard: {
    duration: durations.standard,
    ease: easings.easeOutExpo,
  } satisfies Transition,

  micro: {
    duration: durations.micro,
    ease: easings.easeOutCirc,
  } satisfies Transition,
} as const

// ─────────────────────────────────────────────
// ANIMATION VARIANT PRESETS
// Compose these in components via `variants` prop.
// ─────────────────────────────────────────────

/** Opacity-only fade. Use for content that doesn't move. */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.standard, ease: easings.easeOutCirc } },
  exit:    { opacity: 0, transition: { duration: durations.fast,     ease: 'linear' } },
}

/** Fade + gentle upward rise. The platform's default reveal. */
export const fadeSlideUp: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0,  transition: { duration: durations.comfortable, ease: easings.easeOutExpo } },
  exit:    { opacity: 0, y: 8,  transition: { duration: durations.fast,        ease: easings.easeInExpo  } },
}

/** Fade + slide from right. For drill-down navigation. */
export const panelSlideIn: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0,  transition: { duration: durations.comfortable, ease: easings.easeOutExpo } },
  exit:    { opacity: 0, x: 32, transition: { duration: durations.standard,    ease: easings.easeInExpo  } },
}

/** Scale + fade. For overlays — command palette, modals. */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1,    transition: { duration: durations.standard,    ease: easings.easeOutExpo } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: durations.fast,        ease: easings.easeInExpo  } },
}

/**
 * Stagger container — wraps a list of children and staggers their reveal.
 * Apply to the parent; children use any individual variant.
 */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

export const staggerContainerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
}

// ─────────────────────────────────────────────
// HERO-SPECIFIC VARIANTS
// The marketing hero has its own deliberate reveal
// sequence that is more expressive than UI transitions.
// ─────────────────────────────────────────────

/**
 * Word/phrase reveal — the line rises from below its overflow container.
 * Wrap each line in overflow-hidden, apply this to the inner element.
 */
export const lineReveal: Variants = {
  hidden:  { y: '110%', opacity: 0 },
  visible: (delay: number = 0) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: durations.expressive,
      ease: easings.easeOutExpo,
      delay,
    },
  }),
}

/** Hero chip / badge entrance */
export const chipReveal: Variants = {
  hidden:  { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.2 },
  },
}

/** Hero subheadline reveal — slightly slower than body text */
export const sublineReveal: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.85 },
  },
}
