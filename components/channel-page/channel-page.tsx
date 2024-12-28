'use client'

import { useAtom } from 'jotai'
import { Loader } from 'lucide-react'
import { Button } from '../ui/button'
import { ChannelLogLoader } from './channel-log-loader'
import { LogViewer } from './log-viewer'
import { SearchInput } from './search-input'
import { loaderEnabledAtom } from './store'

export function ChannelPage({ channel }: { channel: string }) {
  // const [search] = useQueryState('search')
  // const searchResults = useQuery(api.events.search, { channel, value: search ?? '' })

  const [loaderEnabled, setLoaderEnabled] = useAtom(loaderEnabledAtom)

  return (
    <div className="flex h-dvh flex-col overflow-y-hidden">
      <header className="sticky top-0 flex items-center justify-between bg-background p-2 shadow">
        <div className="w-1/3">
          <h1 className="px-2 text-2xl font-medium">#{channel}</h1>
        </div>
        <div className="">
          <SearchInput className="w-full" />
        </div>
        <div className="flex w-1/3 items-center justify-end gap-1">
          <Button
            className="w-[12ch]"
            size="sm"
            variant={loaderEnabled ? 'default' : 'secondary'}
            onClick={() => setLoaderEnabled((prev) => !prev)}
          >
            {loaderEnabled ? 'Enabled' : 'Disabled'}
          </Button>
          <ChannelLogLoader channel={channel} />
        </div>
      </header>

      <LogViewer />
    </div>
  )
}

export function PaginatedLoadButton({
  className,
  status,
  loadMore,
}: {
  className?: string
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted'
  loadMore: () => void
}) {
  return (
    <Button
      onClick={() => loadMore()}
      disabled={status !== 'CanLoadMore'}
      size="sm"
      variant="default"
      className={className}
    >
      {status === 'CanLoadMore' ? (
        'Load More'
      ) : status === 'Exhausted' ? (
        'Exhausted'
      ) : (
        <>
          Loading <Loader className="size-5 animate-spin" />
        </>
      )}
    </Button>
  )
}
