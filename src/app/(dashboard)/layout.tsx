import { AppShell } from '@/components/shell/AppShell'

// ─────────────────────────────────────────────
// DASHBOARD LAYOUT
//
// Server Component wrapper. AppShell is a
// Client Component that owns all interactive
// navigation; this layout stays server-rendered.
// ─────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
