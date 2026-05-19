'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings } from '@/lib/motion'

// ─────────────────────────────────────────────
// GENERATING LOADER
//
// Plays through a sequence of "AI thinking" steps
// then calls onComplete so the parent can reveal cards.
// Total duration: ~2,600ms.
// ─────────────────────────────────────────────

const STEPS = [
  'Portföy metrikleri yükleniyor',
  'Enflasyon verileri analiz ediliyor',
  'Makroekonomik göstergeler inceleniyor',
  'Fırsat taraması yapılıyor',
  'Öngörüler derleniyor',
]

const STEP_DELAYS = [0, 420, 880, 1320, 1720]
const COMPLETE_DELAY = 2600

interface GeneratingLoaderProps {
  onComplete: () => void
}

export function GeneratingLoader({ onComplete }: GeneratingLoaderProps) {
  const [completedSteps, setCompletedSteps] = useState(0)
  const [finishing, setFinishing] = useState(false)
  const onCompleteRef = useRef(onComplete)

  // Keep ref in sync with latest callback without retriggering the timer effect
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const timers = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => setCompletedSteps(i + 1), delay + 200)
    )
    const finishTimer = setTimeout(() => setFinishing(true), COMPLETE_DELAY - 200)
    const doneTimer   = setTimeout(() => onCompleteRef.current(), COMPLETE_DELAY)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finishTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: easings.easeOutExpo }}
      className="flex flex-col items-center justify-center py-14 px-6"
    >
      {/* Glowing orb with concentric pulse rings */}
      <div className="relative flex items-center justify-center mb-8" style={{ width: 88, height: 88 }}>
        {/* Scan line — sweeps across the orb area */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212,164,46,0.50), transparent)',
          }}
          animate={{ top: ['10%', '90%', '10%'], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />

        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '1px solid rgba(212,164,46,0.12)' }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute rounded-full"
          style={{ inset: 10, border: '1px solid rgba(212,164,46,0.22)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        {/* Core */}
        <motion.div
          className="relative z-10 h-9 w-9 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,164,46,0.55) 0%, rgba(212,164,46,0.10) 100%)',
            boxShadow: '0 0 22px rgba(212,164,46,0.35), 0 0 44px rgba(212,164,46,0.12)',
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Status heading */}
      <AnimatePresence mode="wait">
        <motion.p
          key={finishing ? 'done' : 'processing'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'type-body-sm font-medium mb-6 text-center',
            finishing ? 'text-[var(--color-positive)]' : 'text-[var(--color-fg-subtle)]'
          )}
        >
          {finishing ? 'Öngörüler hazır' : 'AI portföy verilerinizi analiz ediyor…'}
        </motion.p>
      </AnimatePresence>

      {/* Step checklist */}
      <div className="space-y-2.5 w-full max-w-xs">
        {STEPS.map((step, i) => {
          const isDone    = completedSteps > i
          const isCurrent = completedSteps === i

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isCurrent || isDone ? 1 : 0.35, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              {/* Status icon */}
              <div className="relative h-4 w-4 shrink-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isDone ? (
                    <motion.svg
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: easings.easeOutExpo }}
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                      className="text-[var(--color-positive)]"
                    >
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  ) : (
                    <motion.div
                      key="dot"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: isCurrent ? '#D4A42E' : 'rgba(255,255,255,0.15)' }}
                      animate={isCurrent ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <span className={cn(
                'type-label-sm transition-colors duration-200',
                isDone    ? 'text-[var(--color-fg-subtle)]' : '',
                isCurrent ? 'text-[var(--color-accent-300)]' : '',
                !isDone && !isCurrent ? 'text-[var(--color-fg-disabled)]' : '',
              )}>
                {step}
                {isCurrent && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  >
                    …
                  </motion.span>
                )}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Thin progress bar */}
      <div className="mt-8 w-full max-w-xs h-px bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #D4A42E, rgba(212,164,46,0.4))' }}
          initial={{ width: '0%' }}
          animate={{ width: `${(completedSteps / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: easings.easeOutExpo }}
        />
      </div>
    </motion.div>
  )
}
