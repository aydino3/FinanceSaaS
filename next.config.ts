import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Tree-shake barrel imports from heavy libraries (Next swaps named
  // imports for direct paths so unused subpaths drop from the bundle).
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'recharts',
      '@tanstack/react-query',
    ],
  },

  // Strip console.* in production (keep errors for crash reporting).
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
