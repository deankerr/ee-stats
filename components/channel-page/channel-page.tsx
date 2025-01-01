'use client'

import { PageHeader } from '../page-header'
import { LogsBrowser } from './logs-browser'
import { SearchResultsBrowser } from './search-results-browser'

export function ChannelPage({ channel }: { channel: string }) {
  return (
    <div className="flex h-dvh flex-col overflow-y-hidden">
      <PageHeader channel={channel} page="feed" />
      <div className="stack flex-1 overflow-hidden">
        <LogsBrowser channel={channel} />
        <SearchResultsBrowser channel={channel} />
      </div>
    </div>
  )
}
