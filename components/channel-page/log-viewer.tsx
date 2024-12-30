import type { LogEntry } from '@/convex/types'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { CLILoadingSpinner } from './cli-spinner'
import { LogEntryLine } from './log-entry-line'
import { useChannelLog } from './use-channel-log'

const atTopThreshold = 30

export function LogViewContainer({ channel }: { channel: string }) {
  const channelQuery = useChannelLog(channel)

  if (channelQuery.status === 'LoadingFirstPage') {
    return (
      <LogViewerShell className="grid place-content-center p-4">
        <CLILoadingSpinner spinner="slash" border="double" />
      </LogViewerShell>
    )
  }

  if (channelQuery.status === 'Exhausted' && !channelQuery.results.length) {
    return (
      <LogViewerShell className="grid place-content-center p-4">
        <div>No results</div>
      </LogViewerShell>
    )
  }

  const LoadMoreButton = (
    <Button size="lg" onClick={() => channelQuery.loadNext()} style={{ overflowAnchor: 'none' }}>
      Load More
    </Button>
  )

  return <LogViewer logEntries={channelQuery.results} btn={LoadMoreButton} />
}

export function LogViewer({ logEntries, btn }: { logEntries: LogEntry[]; btn: React.JSX.Element }) {
  // const setRequestLoadMore = useSetAtom(requestLoadMoreAtom)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef<number>(0)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const isScrollingUp = containerRef.current.scrollTop < lastScrollTop.current
    const isWithinThreshold = containerRef.current.scrollTop < atTopThreshold
    // if (isWithinThreshold && isScrollingUp) setRequestLoadMore(true)

    lastScrollTop.current = containerRef.current.scrollTop
  }, [])

  const initialScrollToEnd = useRef(false)
  useEffect(() => {
    if (containerRef.current && !initialScrollToEnd.current && logEntries?.length) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
      initialScrollToEnd.current = true
    }
  }, [logEntries])

  return (
    <LogViewerShell ref={containerRef} onScroll={handleScroll} className="">
      {/* <CLILoadingSpinner /> */}
      {btn}

      {logEntries.toReversed().map((item) => (
        <LogEntryLine
          key={item._id}
          type={item.type}
          name={item.nick}
          content={item.content}
          timestamp={item.timestamp}
        />
      ))}
      <div
        className="h-8 bg-muted text-center text-xs text-muted-foreground"
        style={{ overflowAnchor: 'auto' }}
      >
        the bottom
      </div>
    </LogViewerShell>
  )
}

function LogViewerShell({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto overflow-x-hidden', className)}
      style={{ overflowAnchor: 'none' }}
      {...props}
    >
      {children}
    </div>
  )
}
