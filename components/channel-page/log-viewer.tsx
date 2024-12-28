import { cn } from '@/lib/utils'
import { useAtom, useAtomValue } from 'jotai'
import { Loader2Icon } from 'lucide-react'
import { memo, useCallback, useRef } from 'react'
import { LoadingTerminalSpinner } from './terminal-spinner'
import { channelEventsAtom, requestLoadMoreAtom } from './store'

const istime = false

function formatTimestamp(timestamp: number): string {
  if (istime) return timestamp.toString()

  const date = new Date(timestamp)
  return date
    .toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(',', '')
}

const nameColors = [
  'text-red-500',
  'text-orange-500',
  'text-amber-500',
  'text-yellow-500',
  'text-lime-500',
  'text-green-500',
  'text-emerald-500',
  'text-teal-500',
  'text-cyan-500',
  'text-sky-500',
  'text-blue-500',
  'text-indigo-500',
  'text-violet-500',
  'text-purple-500',
  'text-fuchsia-500',
  'text-pink-500',
  'text-rose-500',
]

function getNameColor(nick: string): string {
  return nameColors[Number.parseInt(nick.replaceAll(/[^a-zA-Z0-9]/g, ''), 36) % nameColors.length]
}

export function LogViewer() {
  const logEvents = useAtomValue(channelEventsAtom)
  // actual loader
  const [isLoadingMore, setRequestLoadMore] = useAtom(requestLoadMoreAtom)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef<number>(0)

  // Handle scroll events to detect when user is pulling to refresh
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const { scrollTop } = containerRef.current

    // Only trigger near-top when actively scrolling upward
    const isScrollingUp = scrollTop < lastScrollTop.current

    // Trigger load when pulled near top
    if (scrollTop < 10 && isScrollingUp && !isLoadingMore) {
      setRequestLoadMore(true)
    }

    lastScrollTop.current = scrollTop
  }, [isLoadingMore, setRequestLoadMore])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 snap-y snap-mandatory overflow-y-auto overflow-x-hidden py-[2lh]"
    >
      <LoadingTerminalSpinner />

      <div className="flex flex-col gap-0.5 px-[1ch]">
        {logEvents
          ?.sort((a, b) => a.timestamp - b.timestamp)
          .map((item) => (
            <div key={item._id} className="flex snap-start">
              <div className="flex-none font-medium text-muted-foreground">
                {formatTimestamp(item.timestamp)}
              </div>
              <div
                title={item.name}
                className={cn(getNameColor(item.name), 'w-[20ch] flex-none truncate text-right font-medium')}
              >
                {item.name}
              </div>
              <div className="ml-[1ch] overflow-hidden break-words border-l pl-[1ch]">{item.content}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

const LogTopLoader = memo(() => <Loader2Icon className="animate-spin" />)
LogTopLoader.displayName = 'LogTopLoader'
