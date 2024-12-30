import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useInfiniteScroll } from '@reactuses/core'
import { usePaginatedQuery } from 'convex/react'
import { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { CLILoadingSpinner } from './cli-spinner'
import { LogEntryLine } from './log-entry-line'

const minThreshold = 1600
const maxThreshold = 20

const initialNumItems = 500
const loadMoreNumItems = 500

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
      if (containerRef.current.scrollTop <= minThreshold) {
        console.log('load more')
        loadMore(loadMoreNumItems)
      }
    },
    {
      direction: 'top',
      distance: minThreshold,
      onScroll: () => {
        if (!containerRef.current) return
        if (containerRef.current.scrollTop <= 20) {
          containerRef.current.scrollTop = 20
        }
      },
    },
  )

  const initialScrollToEnd = useRef(false)
  useEffect(() => {
    if (initialScrollToEnd.current) return
    const latestLogEl = document.getElementById('ee-log-entry-1')
    if (latestLogEl) {
      latestLogEl.scrollIntoView()
      initialScrollToEnd.current = true
    }
  }, [status])

  return (
    <>
      {/* button panel */}
      <div className="fixed left-1 top-12 z-40 space-x-2 px-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const firstLogEl = document.getElementById(`ee-log-entry-${results.length}`)
            if (firstLogEl) firstLogEl.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          scroll 1st
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const latestLogEl = document.getElementById('ee-log-entry-1')
            if (latestLogEl) latestLogEl.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          scroll last
        </Button>

        <Button size="sm" variant="outline" onClick={() => loadMore(loadMoreNumItems)}>
          load more
        </Button>
      </div>

      {/* scroll container */}
      <div
        className={cn('relative flex-1 overflow-y-auto overflow-x-hidden px-[1ch]')}
        style={{
          scrollbarGutter: 'stable',
          paddingTop: maxThreshold,
        }}
        ref={containerRef}
      >
        {/* loader */}
        {isLoading && (
          <CLILoadingSpinner
            className={cn('sticky top-0 mx-auto bg-background shadow')}
            style={{ marginBottom: maxThreshold + 10 }}
          />
        )}

        {results.toReversed().map((item, i) => (
          <LogEntryLine
            id={`ee-log-entry-${results.length - i}`}
            key={item._id}
            type={item.type}
            name={item.nick}
            content={item.content}
            timestamp={item.timestamp}
          />
        ))}
      </div>

      <div className={cn('flex h-8 flex-none items-center border-t bg-background px-2 text-sm')}>
        {status} {results.length}
      </div>
    </>
  )
}
