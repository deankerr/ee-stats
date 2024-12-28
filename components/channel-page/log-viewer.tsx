import { useAtomValue, useSetAtom } from 'jotai'
import { Loader2Icon } from 'lucide-react'
import { memo, useCallback, useRef } from 'react'
import { channelEventItemsAtom, requestLoadMoreAtom } from './store'
import { LoadingTerminalSpinner } from './terminal-spinner'

const atTopThreshold = 20

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

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 snap-y snap-mandatory overflow-y-auto overflow-x-hidden pb-[1lh] pt-[3lh]"
    >
      <LoadingTerminalSpinner spinners={false} />

      <div className="flex flex-col gap-0.5 px-[1ch]">
        {channelEventItems?.map((item) => (
          <LogItem key={item._id} name={item.name} content={item.content} timestamp={item.timestamp} />
        ))}
      </div>
    </div>
  )
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp)
    .toLocaleString('en-CA', {
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

function computeNameColor(name: string): string {
  const normalizedName = name.toLowerCase()
  let hash = 0

  for (let i = 0; i < normalizedName.length; i++) {
    hash = (hash << 5) - hash + normalizedName.charCodeAt(i)
    hash = hash & hash
  }

  return nameColors[Math.abs(hash) % nameColors.length]
}

function formatName(name: string): string {
  return name.length > 18 ? `${name.slice(0, 18)}…` : name.padStart(19)
}

const LogItem = memo(({ name, content, timestamp }: { name: string; content: string; timestamp: number }) => {
  return (
    <div className="flex snap-start">
      <div className="flex-none whitespace-pre font-medium text-muted-foreground">
        {formatTimestamp(timestamp)}
        <span className={computeNameColor(name)}>{formatName(name)}</span>
      </div>
      <div className="ml-[1ch] overflow-hidden break-words border-l pl-[1ch]">{content}</div>
    </div>
  )
})
LogItem.displayName = 'LogItem'

const LogTopLoader = memo(() => <Loader2Icon className="animate-spin" />)
LogTopLoader.displayName = 'LogTopLoader'
