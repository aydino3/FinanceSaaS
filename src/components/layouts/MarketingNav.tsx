'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { durations, easings } from '@/lib/motion'

// ─────────────────────────────────────────────
// LOGO MARK
// ─────────────────────────────────────────────

function LogoMark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]
                 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]
                 rounded-sm"
      aria-label="FinansOS — Ana sayfa"
    >
      {/* Geometric mark */}
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-[4px]
                   bg-[var(--color-accent-400)] transition-colors
                   duration-[var(--duration-micro)]
                   group-hover:bg-[var(--color-accent-500)]"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          {/* Abstract ₺ / upward-trend mark */}
          <path
            d="M3 10.5 L7 3.5 L11 10.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--color-fg-inverse)]"
          />
          <path
            d="M4.5 8H9.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="text-[var(--color-fg-inverse)]"
          />
        </svg>
      </span>

      {/* Wordmark */}
      <span
        className="type-body-sm font-medium tracking-[-0.01em]
                   text-[var(--color-fg)] transition-colors
                   duration-[var(--duration-micro)]
                   group-hover:text-[var(--color-fg-muted)]"
      >
        FinansOS
      </span>
    </Link>
  )
}

// ─────────────────────────────────────────────
// MARKETING NAV
// ─────────────────────────────────────────────

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll position to apply blur-backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    // Passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.comfortable, ease: easings.easeOutExpo }}
      role="banner"
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'flex h-14 items-center px-6',
        'transition-all',
        'duration-[var(--duration-comfortable)]',
        scrolled
          ? 'bg-[rgba(12,12,14,0.55)] backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.06] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]'
          : 'bg-transparent',
      )}
    >
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-50 focus:px-4 focus:py-2 focus:rounded-md
                   focus:bg-[var(--color-surface)] focus:text-[var(--color-fg)]
                   focus:type-body-sm focus:shadow-[var(--shadow-elevation-2)]"
      >
        Ana içeriğe geç
      </a>

      <nav
        className="flex w-full items-center justify-between"
        aria-label="Ana navigasyon"
      >
        <LogoMark />

        {/* Right-side actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={cn(
              'type-body-sm font-medium',
              'text-[var(--color-fg-muted)]',
              'transition-colors duration-[var(--duration-micro)]',
              'hover:text-[var(--color-fg)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--color-accent-400)]',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]',
              'rounded-sm px-1',
            )}
          >
            Demoyu gör
          </Link>

          <Link
            href="/dashboard"
            className={cn(
              'inline-flex items-center justify-center',
              'h-8 px-4 rounded-md',
              'type-body-sm font-medium',
              'bg-[var(--color-accent-400)] text-[var(--color-fg-inverse)]',
              'transition-colors duration-[var(--duration-micro)]',
              'hover:bg-[var(--color-accent-500)]',
              'active:bg-[var(--color-accent-600)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--color-accent-400)]',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]',
            )}
          >
            Panele gir
          </Link>
        </div>
      </nav>
    </motion.header>
  )
}
