import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { usePaginatedQuery } from 'convex/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { CircleDashedIcon, CircleIcon } from 'lucide-react'
import { memo, useEffect } from 'react'
import { channelEventItemsAtom, loaderEnabledAtom, requestLoadMoreAtom } from './store'

const initialNumItems = 1000
const loadMoreNumItems = 1000

export const ChannelLogLoader = memo(({ channel }: { channel: string }) => {
  const loaderEnabled = useAtomValue(loaderEnabledAtom)

  const { results, isLoading, status, loadMore } = usePaginatedQuery(
    api.events.paginate,
    { channel },
    { initialNumItems },
  )

  useEffect(() => console.log(results.length, isLoading, status))

  const setChannelEventItems = useSetAtom(channelEventItemsAtom)
  useEffect(() => {
    console.log('set', results.length)
    setChannelEventItems(results.reverse())
  }, [results, setChannelEventItems])

  const [requestLoadMore, setRequestLoadMore] = useAtom(requestLoadMoreAtom)
  useEffect(() => {
    if (requestLoadMore) {
      if (!isLoading && loaderEnabled) loadMore(loadMoreNumItems)
      setRequestLoadMore(false)
    }
  }, [loadMore, requestLoadMore, setRequestLoadMore, isLoading, loaderEnabled])

  return (
    <div className={cn('stack flex-none')} onClick={() => loadMore(loadMoreNumItems)}>
      <Indicator n={results.length} isLoading={isLoading} />
    </div>
  )
})
ChannelLogLoader.displayName = 'ChannelLogLoader'

function Indicator({ n, isLoading }: { n?: number; isLoading: boolean }) {
  const isActive = typeof n === 'number'

  const Icon = isLoading || !isActive ? CircleDashedIcon : CircleIcon

  return (
    <div className="grid place-content-center place-items-center px-1 text-xs text-muted-foreground [&>*]:col-start-1 [&>*]:row-start-1">
      <Icon className={cn('size-10', isLoading && 'animate-spin')} />
      <div>{n}</div>
    </div>
  )
}
