'use client'

import { useConvex } from 'convex/react'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from '../theme-switcher'
import { LogsBrowser } from './logs-browser'
import { SearchInput } from './search-input'
import { SearchResultsBrowser } from './search-results-browser'

export function ChannelPage({ channel }: { channel: string }) {
  return (
    <div className="flex h-dvh flex-col overflow-y-hidden">
      <ChannelHeader channel={channel} />
      <div className="stack flex-1 overflow-hidden">
        <LogsBrowser channel={channel} />
        <SearchResultsBrowser channel={channel} />
      </div>
    </div>
  )
}

function ChannelHeader({ channel }: { channel: string }) {
  return (
    <header className="grid flex-none grid-cols-3 items-center border-b bg-background px-2 py-1 shadow">
      <div className="flex items-center gap-2 px-2">
        <h1 className="text-lg">
          {'ee'} #{channel}
        </h1>
      </div>

      <div className="">
        <SearchInput className="w-full" />
      </div>

      <div className="flex items-center justify-end gap-1">
        <ConvexSpy />
        <ThemeSwitcher />
      </div>
    </header>
  )
}

function ConvexSpy() {
  const [count, setCount] = useState(0)
  const cvx = useConvex()
  useEffect(() => console.log(cvx))
  return <div onClick={() => setCount((p) => p + 1)}>C{count}</div>
}
