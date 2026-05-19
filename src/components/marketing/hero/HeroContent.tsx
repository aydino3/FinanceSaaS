'use client'

import { useReducedMotion, motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface MetricBadgeProps {
  value: string
  label: string
  delay: number
  prefersReduced: boolean
}

// ─────────────────────────────────────────────
// SUBCOMPONENTS
// ─────────────────────────────────────────────

/**
 * A single headline line with the clip-rise reveal animation.
 * Each line wraps its text in an overflow-hidden parent so the
 * translateY reveal creates a "rising from below the baseline" effect.
 */
function HeadlineLine({
  children,
  delay,
  prefersReduced,
  className,
}: {
  children: React.ReactNode
  delay: number
  prefersReduced: boolean
  className?: string
}) {
  return (
    // overflow-hidden clips the child during the upward reveal
    <div className="overflow-hidden">
      <motion.div
        initial={prefersReduced ? { y: 0, opacity: 1 } : { y: '105%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : {
                duration: durations.expressive,
                ease: easings.easeOutExpo,
                delay,
              }
        }
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Floating platform metric — shown below the CTAs to convey data scale.
 * Appears as a small uppercase label with a subtle value.
 */
function MetricBadge({ value, label, delay, prefersReduced }: MetricBadgeProps) {
  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: durations.standard, ease: 'linear', delay }
      }
      className="flex flex-col items-center gap-0.5"
    >
      <span
        className="tabular type-body-sm font-medium text-[var(--color-fg)]"
        aria-label={`${value} ${label}`}
      >
        {value}
      </span>
      <span className="type-label-sm text-[var(--color-fg-subtle)]">
        {label}
      </span>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// HERO CONTENT
// ─────────────────────────────────────────────

export function HeroContent() {
  const prefersReduced = useReducedMotion() ?? false

  // ── CTA transition shared config ──
  const ctaTransition = (delay: number) =>
    prefersReduced
      ? { duration: 0 }
      : { duration: durations.comfortable, ease: easings.easeOutExpo, delay }

  return (
    <div
      className="relative z-10 flex w-full flex-col items-center text-center"
      aria-labelledby="hero-headline"
    >

      {/* ── Product identity chip ── */}
      <motion.div
        initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ctaTransition(0.15)}
        className="mb-8 inline-flex items-center gap-2 rounded-full
                   border border-[var(--color-accent-400)]/20
                   bg-[var(--color-accent-400)]/5
                   px-4 py-1.5
                   backdrop-blur-sm"
      >
        {/* Ambient pulse dot */}
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full
                       bg-[var(--color-accent-400)] opacity-50"
            style={{ animationDuration: '2.4s' }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full
                       bg-[var(--color-accent-400)]"
          />
        </span>
        <span className="type-label-sm text-[var(--color-accent-400)]">
          Intelligent Investment OS
        </span>
      </motion.div>

      {/* ── Primary headline ── */}
      {/*
        Each line is independently revealed with a staggered delay.
        The parent div defines max-width and alignment;
        the overflow-hidden containers clip the animation.
      */}
      <h1
        id="hero-headline"
        className="mb-6 max-w-3xl space-y-1"
        aria-label="Your wealth. In real terms."
      >
        <HeadlineLine delay={0.35} prefersReduced={prefersReduced}>
          <span
            className={cn(
              'block font-sans font-light text-[var(--color-fg)]',
              // Responsive display scale
              'text-[2.5rem] leading-[1.05] tracking-[-0.04em]',
              'sm:text-[3rem]',
              'lg:text-[4.25rem]',
              'xl:text-[4.5rem]',
            )}
          >
            Your wealth.
          </span>
        </HeadlineLine>

        <HeadlineLine delay={0.50} prefersReduced={prefersReduced}>
          <span
            className={cn(
              'block font-sans font-light',
              // Gradient text — accent-tinted for the key phrase
              'bg-gradient-to-r from-[var(--color-fg)] via-[var(--color-fg)] to-[var(--color-fg-muted)]',
              'bg-clip-text text-transparent',
              // Responsive display scale
              'text-[2.5rem] leading-[1.05] tracking-[-0.04em]',
              'sm:text-[3rem]',
              'lg:text-[4.25rem]',
              'xl:text-[4.5rem]',
            )}
          >
            In real terms.
          </span>
        </HeadlineLine>
      </h1>

      {/* ── Sub-headline ── */}
      <motion.p
        initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ctaTransition(0.82)}
        className={cn(
          'mb-10 max-w-xl',
          'type-body-lg text-[var(--color-fg-muted)]',
          'sm:type-body-xl',
        )}
      >
        The only investment platform that shows you what your portfolio&nbsp;
        <em className="not-italic text-[var(--color-fg)]">actually returns</em>
        &nbsp;— after Turkey&apos;s inflation.
      </motion.p>

      {/* ── CTA row ── */}
      <div
        className="mb-14 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        role="group"
        aria-label="Başlamak için seçenekler"
      >
        {/* Primary CTA */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ctaTransition(1.02)}
        >
          <Link
            href="/dashboard"
            className={cn(
              'inline-flex items-center justify-center gap-2',
              'h-11 px-6 rounded-md',
              'type-body-sm font-medium',
              'bg-[var(--color-accent-400)] text-[var(--color-fg-inverse)]',
              'transition-colors duration-[var(--duration-micro)]',
              'hover:bg-[var(--color-accent-500)]',
              'active:bg-[var(--color-accent-600)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--color-accent-400)]',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]',
              'shadow-[0_0_24px_rgba(212,164,46,0.18)]',
              'hover:shadow-[0_0_32px_rgba(212,164,46,0.26)]',
            )}
          >
            Demoyu aç
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7h8M7 3l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>

        {/* Ghost CTA */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ctaTransition(1.12)}
        >
          <Link
            href="#how-it-works"
            className={cn(
              'inline-flex items-center justify-center gap-2',
              'h-11 px-6 rounded-md',
              'type-body-sm font-medium',
              'text-[var(--color-fg-muted)] bg-transparent',
              'border border-white/[0.09]',
              'transition-colors duration-[var(--duration-micro)]',
              'hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]',
              'active:bg-[var(--color-surface-raised)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--color-accent-400)]',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]',
            )}
          >
            Nasıl çalışır
          </Link>
        </motion.div>
      </div>

      {/* ── Platform metrics strip ── */}
      <motion.div
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : { duration: durations.standard, ease: 'linear', delay: 1.3 }
        }
        className="flex items-center gap-5 sm:gap-8"
        aria-label="Platform istatistikleri"
      >
        <MetricBadge
          value="847+"
          label="TEFAS Fonu"
          delay={1.30}
          prefersReduced={prefersReduced}
        />

        {/* Dot separator */}
        <span aria-hidden="true" className="h-6 w-px bg-white/[0.08]" />

        <MetricBadge
          value="5Y+"
          label="CPI Verisi"
          delay={1.40}
          prefersReduced={prefersReduced}
        />

        {/* Dot separator */}
        <span aria-hidden="true" className="h-6 w-px bg-white/[0.08]" />

        <MetricBadge
          value="Reel"
          label="Getiri Önce"
          delay={1.50}
          prefersReduced={prefersReduced}
        />
      </motion.div>
    </div>
  )
}
