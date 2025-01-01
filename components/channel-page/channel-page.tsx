'use client'

import Link from 'next/link'
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
    <header className="grid flex-none grid-cols-3 items-center border-b bg-background px-2 py-1 text-15 font-[450] shadow">
      <div className="flex items-center gap-2 px-2">
        <h1>ee #{channel} feed</h1>
      </div>

      <div className="">
        <SearchInput className="w-full" />
      </div>

      <div className="flex items-center justify-end gap-1">
        <Link href={`/channel/${channel}/stats`} className="px-1 underline underline-offset-2">
          stats
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  )
}
