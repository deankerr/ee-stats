'use client'

import { useConvex } from 'convex/react'
import { useEffect, useState } from 'react'

export function ConvexState() {
  const [_, setCount] = useState(0)
  const cvx = useConvex()
  useEffect(() => console.log(cvx))
  return <div onClick={() => setCount((p) => p + 1)}>C</div>
}
