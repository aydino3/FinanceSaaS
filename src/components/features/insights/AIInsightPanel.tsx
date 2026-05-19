'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CinematicCard } from '@/components/ui/CinematicCard'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { AIInsight, InsightType, InsightPriority } from '@/types/insights'

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const TYPE_CONFIG: Record<InsightType, { accent: string; glow: string; sourceColor: string }> = {
  portfolio:   { accent: '#D4A42E', glow: 'rgba(212,164,46,0.10)', sourceColor: '#C4A060' },
  macro:       { accent: '#5C6B8A', glow: 'rgba(92,107,138,0.10)',  sourceColor: '#7A8EA8' },
  opportunity: { accent: '#5A9B6B', glow: 'rgba(90,155,107,0.10)', sourceColor: '#6DB87A' },
  risk:        { accent: '#BF6D7A', glow: 'rgba(191,109,122,0.10)', sourceColor: '#BF8090' },
  alert:       { accent: '#C4872A', glow: 'rgba(196,135,42,0.12)',  sourceColor: '#C49050' },
}

const PRIORITY_CONFIG: Record<InsightPriority, { dot: string; label: string } | null> = {
  critical: { dot: '#BF6D7A', label: 'Kritik' },
  high:     { dot: '#D4A42E', label: 'Önemli' },
  normal:   null,
  low:      null,
}

// ─────────────────────────────────────────────
// TYPEWRITER HOOK
// ─────────────────────────────────────────────

function useTypewriter(text: string, charsPerSecond = 45, startDelayMs = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(text.length === 0)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    if (text.length === 0) { setDisplayed(''); setDone(true); return }
    setDisplayed('')
    setDone(false)

    timerRef.current = setTimeout(() => {
      let i = 0
      intervalRef.current = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(intervalRef.current)
          setDone(true)
        }
      }, 1000 / charsPerSecond)
    }, startDelayMs)

    return () => {
      clearTimeout(timerRef.current)
      clearInterval(intervalRef.current)
    }
  }, [text, charsPerSecond, startDelayMs])

  return { displayed, done }
}

// ─────────────────────────────────────────────
// AI INSIGHT PANEL
// ─────────────────────────────────────────────

interface AIInsightPanelProps {
  insight: AIInsight
  isFeatured?: boolean
  revealDelay?: number   // seconds; used for stagger
}

export function AIInsightPanel({ insight, isFeatured = false, revealDelay = 0 }: AIInsightPanelProps) {
  const cfg      = TYPE_CONFIG[insight.type]
  const priority = PRIORITY_CONFIG[insight.priority]
  const bodyParagraphs = insight.body.split('\n\n').filter(Boolean)

  // Featured card: typewriter for lead, body reveals after typing done.
  // Non-featured: full content blur-reveals together (staggered by revealDelay).
  const typewriterDelay = (revealDelay + 0.45) * 1000
  const { displayed: typedLead, done: typeDone } = useTypewriter(
    isFeatured ? insight.lead : '',
    46,
    typewriterDelay
  )

  // Tags appear after body is visible
  const [tagsVisible, setTagsVisible] = useState(false)
  useEffect(() => {
    if (!isFeatured) {
      const t = setTimeout(() => setTagsVisible(true), (revealDelay + 0.9) * 1000)
      return () => clearTimeout(t)
    }
    if (typeDone) {
      const t = setTimeout(() => setTagsVisible(true), 600)
      return () => clearTimeout(t)
    }
  }, [isFeatured, revealDelay, typeDone])

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easings.easeOutExpo, delay: revealDelay }}
      className="group"
    >
      <CinematicCard
        className="overflow-hidden"
        glowColor={cfg.glow}
        glowRadius={200}
      >
        {/* Left accent bar — animates down from top on mount */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full origin-top"
          style={{ background: cfg.accent }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.55, ease: easings.easeOutExpo, delay: revealDelay + 0.15 }}
          aria-hidden="true"
        />

        <div className="p-5 pl-6">
          {/* ── Header row ── */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            {/* Source badge */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="type-label-sm font-medium tracking-wide uppercase"
                style={{ color: cfg.sourceColor }}
              >
                {insight.source}
              </span>
              {priority && (
                <>
                  <span className="text-[var(--color-fg-disabled)]" aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: priority.dot, boxShadow: `0 0 6px ${priority.dot}` }}
                      aria-hidden="true"
                    />
                    <span className="type-label-sm" style={{ color: priority.dot }}>
                      {priority.label}
                    </span>
                  </span>
                </>
              )}
            </div>

            {/* Read time + timestamp */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="type-label-sm text-[var(--color-fg-disabled)]">
                {insight.readTime}dk okuma
              </span>
            </div>
          </div>

          {/* ── Title ── */}
          <h3
            className="type-body-sm font-semibold text-[var(--color-fg)] leading-snug mb-3"
            style={{ letterSpacing: '-0.01em', fontSize: '15px', lineHeight: '1.45' }}
          >
            {insight.title}
          </h3>

          {/* ── Hairline divider ── */}
          <div className="h-px bg-white/[0.05] mb-4" aria-hidden="true" />

          {/* ── Content block ── */}
          {isFeatured ? (
            // Featured: typewriter lead → blur-reveal body
            <div className="space-y-3">
              <p
                className="text-[var(--color-fg-muted)]"
                style={{ fontSize: '14px', lineHeight: '1.75', letterSpacing: '0.005em' }}
                aria-live="polite"
              >
                {typedLead}
                {!typeDone && (
                  <motion.span
                    className="inline-block ml-px align-middle"
                    style={{ width: 1.5, height: '0.85em', background: cfg.accent }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  />
                )}
              </p>

              <AnimatePresence>
                {typeDone && (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(7px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="space-y-2.5"
                  >
                    {bodyParagraphs.map((para, pi) => (
                      <p
                        key={pi}
                        className="text-[var(--color-fg-subtle)]"
                        style={{ fontSize: '13.5px', lineHeight: '1.80', letterSpacing: '0.005em' }}
                      >
                        {para}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Non-featured: entire content blur-reveals together
            <motion.div
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: revealDelay + 0.28 }}
              className="space-y-2.5"
            >
              <p
                className="text-[var(--color-fg-muted)]"
                style={{ fontSize: '14px', lineHeight: '1.75', letterSpacing: '0.005em' }}
              >
                {insight.lead}
              </p>
              {bodyParagraphs.map((para, pi) => (
                <p
                  key={pi}
                  className="text-[var(--color-fg-subtle)]"
                  style={{ fontSize: '13.5px', lineHeight: '1.80', letterSpacing: '0.005em' }}
                >
                  {para}
                </p>
              ))}
            </motion.div>
          )}

          {/* ── Metric chip ── */}
          {insight.metric && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                ease: easings.easeOutExpo,
                delay: isFeatured ? 0 : revealDelay + 0.55,
              }}
              style={{ opacity: isFeatured && !typeDone ? 0 : 1 }}
              className="mt-4 inline-flex items-baseline gap-3 rounded-lg px-4 py-2.5
                         border border-white/[0.08] bg-[var(--color-surface-raised)]"
            >
              <span
                className="font-mono font-bold tabular-nums"
                style={{ fontSize: '22px', color: cfg.accent, letterSpacing: '-0.02em' }}
              >
                {insight.metric.value}
              </span>
              <div className="flex flex-col">
                <span className="type-label-sm text-[var(--color-fg-subtle)]">
                  {insight.metric.label}
                </span>
                {insight.metric.delta && (
                  <span
                    className="type-label-sm tabular-nums"
                    style={{
                      color: insight.metric.positive === true
                        ? 'var(--color-positive)'
                        : insight.metric.positive === false
                        ? 'var(--color-negative)'
                        : 'var(--color-fg-disabled)',
                    }}
                  >
                    {insight.metric.delta}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Tags + action row ── */}
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            {/* Tags */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
              <AnimatePresence>
                {tagsVisible && insight.tags.map((tag, ti) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22, ease: easings.easeOutExpo, delay: ti * 0.05 }}
                    className="type-label-sm text-[var(--color-fg-disabled)]
                               px-2 py-0.5 rounded-full border border-white/[0.07]
                               bg-white/[0.03]"
                  >
                    {tag}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            {/* Action CTA — visible on hover */}
            {insight.action && (
              <Link
                href={insight.action.href}
                className="type-label-sm font-medium opacity-0 group-hover:opacity-100
                           transition-opacity duration-200 whitespace-nowrap
                           focus-visible:opacity-100 focus-visible:outline-none
                           focus-visible:ring-1 focus-visible:ring-[var(--color-accent-400)]
                           rounded-sm"
                style={{ color: cfg.accent }}
              >
                {insight.action.label} →
              </Link>
            )}
          </div>
        </div>
      </CinematicCard>
    </motion.div>
  )
}
