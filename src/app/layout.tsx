import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'], // latin-ext includes Turkish: ğ ü ş ı ö ç
  display: 'swap',
  axes: ['opsz'], // optical sizing axis for variable font
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FinansOS — Intelligent Investment Platform for Turkey',
    template: '%s — FinansOS',
  },
  description:
    'Turkey\'s first investment platform that measures your returns against inflation. ' +
    'Track TEFAS funds, real returns, and get AI-powered portfolio insights.',
  keywords: ['TEFAS', 'yatırım', 'enflasyon', 'portföy', 'fon', 'real return', 'Turkey investing'],
  authors: [{ name: 'FinansOS' }],
  creator: 'FinansOS',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'FinansOS',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        {children}
      </body>
    </html>
  )
}
