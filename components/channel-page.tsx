'use client'

import { api } from '@/convex/_generated/api'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { Loader } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { LogViewer } from './log-viewer'
import { SearchInput } from './search-input'
import { Button } from './ui/button'

export function ChannelPage({ channel }: { channel: string }) {
  const logPaginated = usePaginatedQuery(api.events.paginate, { channel }, { initialNumItems: 5 })

  const [search] = useQueryState('search')
  const searchResults = useQuery(api.events.search, { channel, value: search ?? '' })

  const items = search ? searchResults ?? [] : logPaginated.results

  return (
    <>
      <header className="sticky top-0 bg-background z-10 items-center flex shadow justify-between p-2">
        <h1 className="text-2xl px-2 font-medium">#{channel}</h1>
        <SearchInput className="" />
        <div className="text-muted-foreground">{logPaginated.results.length}</div>
      </header>
      <div className="flex flex-col-reverse text-sm">
        <LogViewer items={items} />
        <div className="pb-2 flex">
          <PaginatedLoadButton
            className="flex mx-auto w-96"
            status={logPaginated.status}
            loadMore={() => logPaginated.loadMore(50)}
          />
        </div>
      </div>
    </>
  )
}

function PaginatedLoadButton({
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
