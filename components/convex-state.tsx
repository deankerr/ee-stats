'use client'

import { useConvex } from 'convex/react'
import { memo } from 'react'

export const ConvexState = memo(() => {
  const cvx = useConvex()
  return <div onClick={() => console.log(cvx)}>C</div>
})
ConvexState.displayName = 'ConvexState'
