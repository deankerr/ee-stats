import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
}

export default process.env.ANALYZE === 'true' ? bundleAnalyzer()(nextConfig) : nextConfig
