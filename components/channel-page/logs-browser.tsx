import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useInfiniteScroll } from '@reactuses/core'
import { usePaginatedQuery } from 'convex/react'
import { ArrowDownIcon, ArrowUpIcon, RefreshCcwIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { CLILoadingSpinner } from './cli-spinner'
import { LogEntryLine } from './log-entry-line'

const containerPaddingTop = 20
const atTopThreshold = 60

const initialNumItems = 200
const loadMoreNumItems = 200

export function LogsBrowser({ channel }: { channel: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.queries.paginate,
    { channel },
    { initialNumItems },
  )

  useInfiniteScroll(
    containerRef,
    () => {
      if (!containerRef.current) return
      console.log('load more')
      loadMore(loadMoreNumItems)
    },
    {
      direction: 'top',
      distance: atTopThreshold,
    },
  )

  const initialScrollToEnd = useRef(false)
  useEffect(() => {
    if (initialScrollToEnd.current) return
    const latestLogEl = document.getElementById('ee-log-entry-1')
    if (latestLogEl) {
      latestLogEl.scrollIntoView()
      initialScrollToEnd.current = true
      console.log('first to end')
    }
  }, [status])

  return (
    <>
      <div className="flex flex-col overflow-hidden">
        {/* scroll container */}
        <div
          className={cn(
            'flex-1 snap-y snap-mandatory overflow-y-auto overflow-x-hidden px-[1ch] text-base leading-relaxed [&>*]:snap-start',
          )}
          style={{
            scrollbarGutter: 'stable',
            overflowAnchor: 'none',
            paddingTop: containerPaddingTop,
          }}
          ref={containerRef}
        >
          {/* loader */}
          <CLILoadingSpinner
            className={cn(
              'sticky top-0 mx-auto bg-background shadow-md',
              status === 'LoadingFirstPage' && 'top-1/3',
            )}
            border="double"
            enabled={isLoading}
          />

          {results.toReversed().map((item, i) => (
            <LogEntryLine
              id={`ee-log-entry-${results.length - i}`}
              key={item._id}
              type={item.type}
              name={item.nick}
              content={item.content}
              timestamp={item.timestamp}
              className="flex py-0.5 hover:bg-muted/50"
            />
          ))}
        </div>

        <div className={cn('flex h-6 flex-none items-center border-t bg-background px-2 text-xs')}>
          {status} {results.length}
        </div>
      </div>

      {/* button panel */}
      <div className="fixed left-1 top-12 space-x-2 px-1">
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            const firstLogEl = document.getElementById(`ee-log-entry-${results.length}`)
            if (firstLogEl) firstLogEl.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <ArrowUpIcon className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            const latestLogEl = document.getElementById('ee-log-entry-1')
            if (latestLogEl) latestLogEl.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <ArrowDownIcon className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="outline" onClick={() => loadMore(loadMoreNumItems)}>
          <RefreshCcwIcon className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
