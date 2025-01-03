import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useInfiniteScroll } from '@reactuses/core'
import { usePaginatedQuery } from 'convex/react'
import { ArrowDownIcon } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { ConvexState } from '../convex-state'
import { Button } from '../ui/button'
import { CLILoadingSpinner } from './cli-spinner'
import { LogEntryLine } from './log-entry-line'

const containerPaddingTop = 20
const atTopThreshold = 60
const atEndThreshold = 60

const initialNumItems = 200
const loadMoreNumItems = 200

export function LogsBrowser({ channel }: { channel: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const getIsAtEnd = useCallback(() => {
    if (!containerRef.current) return false
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    return scrollTop >= scrollHeight - clientHeight - atEndThreshold
  }, [])

  const isAtEnd = getIsAtEnd()

  const scrollToLatest = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    const latestLogEl = document.getElementById('ee-log-entry-1')
    if (latestLogEl) latestLogEl.scrollIntoView({ behavior })
  }, [])

  const {
    results,
    isLoading,
    loadMore: loadMoreQuery,
    status,
  } = usePaginatedQuery(api.queries.paginate, { channel }, { initialNumItems })

  const logEntries = results.toReversed()

  const loadMore = useCallback(() => {
    loadMoreQuery(loadMoreNumItems)
  }, [loadMoreQuery])

  useInfiniteScroll(containerRef, loadMore, {
    direction: 'top',
    distance: atTopThreshold,
  })

  const initialScrollToLatest = useRef(false)
  useEffect(() => {
    if (results.length && (getIsAtEnd() || !initialScrollToLatest.current)) {
      scrollToLatest('auto')
      initialScrollToLatest.current = true
    }
  }, [results.length, getIsAtEnd, scrollToLatest])

  return (
    <div className="flex flex-col overflow-hidden">
      {/* scroll container */}
      <div
        className={cn('flex-1 snap-y snap-mandatory overflow-y-auto overflow-x-hidden px-[1ch]')}
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

        {logEntries.map((item, i) => {
          const next = logEntries.at(i + 1)
          const nextDateMarker =
            next && new Date(item.timestamp).getDate() !== new Date(next.timestamp).getDate()
              ? new Date(next.timestamp).toDateString()
              : undefined

          return (
            <LogEntryLine
              id={`ee-log-entry-${results.length - i}`}
              key={item.id}
              type={item.type}
              name={item.nick}
              content={item.content}
              timestamp={item.timestamp}
              className={cn(
                'flex snap-start py-0.5 hover:bg-muted/50',
                i + 1 === results.length && 'snap-end',
              )}
            >
              {nextDateMarker && <div className="text-center">--- {nextDateMarker} ---</div>}
            </LogEntryLine>
          )
        })}

        <div className="h-2" />
      </div>

      {!isAtEnd && (
        <div className="absolute bottom-16 right-16 flex-none">
          <Button size="icon" variant="outline" onClick={() => scrollToLatest('smooth')}>
            <ArrowDownIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        className={cn('absolute bottom-0 right-4 flex h-6 flex-none items-center bg-background px-2 text-xs')}
      >
        {status} {results.length} {isAtEnd ? 'E' : 'X'}
        <ConvexState />
      </div>
    </div>
  )
}
