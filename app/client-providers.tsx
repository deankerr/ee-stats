'use client'

import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache/provider'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { Provider as JotaiProvider } from 'jotai'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string, {
  verbose: false,
})

export function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexProvider client={convex}>
      <ConvexQueryCacheProvider>
        <JotaiProvider>{children}</JotaiProvider>
      </ConvexQueryCacheProvider>
    </ConvexProvider>
  )
}
