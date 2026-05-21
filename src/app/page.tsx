import type { Metadata } from 'next'
import { AppShell } from '@/components/shell/AppShell'

// ─────────────────────────────────────────────
// ROOT PAGE
//
// The application is a single-page system.
// `/` renders the AppShell directly; navigation
// between portfolio, explorer, analytics and
// insights happens through Zustand activeTab —
// no router transitions, no 404 risk.
// ─────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'FinansOS — Intelligent Investment Platform for Turkey',
  description:
    'Portföyünüzün gerçek getirisini görün. TEFAS fonları, ' +
    'enflasyon düzeltmeli analiz ve AI destekli içgörüler.',
  openGraph: {
    title: 'FinansOS — Your wealth. In real terms.',
    description:
      "Turkey's first investment platform that measures your returns " +
      'against inflation. Real returns, not nominal illusions.',
  },
}

export default function RootPage() {
  return <AppShell />
}
