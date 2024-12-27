'use client'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache/provider'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string, {
  verbose: true,
})

export function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexProvider client={convex}>
      <ConvexQueryCacheProvider expiration={1000 * 60}>{children}</ConvexQueryCacheProvider>
    </ConvexProvider>
  )
}
