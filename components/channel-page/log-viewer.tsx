import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { LogEntry } from './log-entry'
import { channelEventItemsAtom, requestLoadMoreAtom } from './store'
import { CLILoadingSpinners } from './terminal-spinner'
import { cn } from '@/lib/utils'

const atTopThreshold = 30

export function LogViewer() {
  const channelEventItems = useAtomValue(channelEventItemsAtom)
  const setRequestLoadMore = useSetAtom(requestLoadMoreAtom)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef<number>(0)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const isScrollingUp = containerRef.current.scrollTop < lastScrollTop.current
    if (containerRef.current.scrollTop < atTopThreshold && isScrollingUp) {
      setRequestLoadMore(true)
    }

    lastScrollTop.current = containerRef.current.scrollTop
  }, [setRequestLoadMore])

  const initialScrollToEnd = useRef(false)
  useEffect(() => {
    if (containerRef.current && !initialScrollToEnd.current && channelEventItems?.length) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
      initialScrollToEnd.current = true
    }
  }, [channelEventItems])

  if (!channelEventItems?.length) {
    return (
      <LogViewerShell className="grid place-content-center p-4">
        <CLILoadingSpinners spinner="slash" border="double" />
      </LogViewerShell>
    )
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 snap-y snap-mandatory overflow-y-auto overflow-x-hidden pb-[0.5lh] pt-[4lh]"
    >
      <CLILoadingSpinners />

      <div className="flex flex-col gap-0.5 px-[1ch]">
        {channelEventItems?.map((item) => (
          <LogEntry key={item._id} name={item.nick} content={item.content} timestamp={item.timestamp} />
        ))}
      </div>
    </div>
  )
}

function LogViewerShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex-1 snap-y snap-mandatory overflow-y-auto overflow-x-hidden pb-[0.5lh] pt-[0.5lh]',
        className,
      )}
    >
      {children}
    </div>
  )
}
