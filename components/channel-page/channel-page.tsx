'use client'

import { ThemeSwitcher } from '../theme-switcher'
import { LogsBrowser } from './logs-browser'
import { SearchInput } from './search-input'

export function ChannelPage({ channel }: { channel: string }) {
  // const [search] = useQueryState('search')
  // const searchResults = useQuery(api.events.search, { channel, value: search ?? '' })

  return (
    <div className="flex h-dvh flex-col overflow-y-hidden">
      <ChannelHeader channel={channel} />
      <LogsBrowser channel={channel} />
    </div>
  )
}

function ChannelHeader({ channel }: { channel: string }) {
  return (
    <header className="sticky top-0 flex items-center justify-between border-b bg-background px-2 py-1 shadow">
      <div className="flex w-1/3">
        <h1 className="px-2 text-lg">ee-stats</h1>
        <h2 className="px-2 text-lg">#{channel}</h2>
      </div>
      <div className="">
        <SearchInput className="w-full" />
      </div>
      <div className="flex w-1/3 items-center justify-end gap-1">
        {/* <ChannelLogLoader channel={channel} /> */}
        <ThemeSwitcher />
      </div>
    </header>
  )
}
