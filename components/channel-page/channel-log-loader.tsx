import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { usePaginatedQuery } from 'convex/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { CircleDashedIcon, CircleIcon } from 'lucide-react'
import { memo, useCallback, useEffect } from 'react'
import { channelEventsAtom, loaderEnabledAtom, requestLoadMoreAtom } from './store'

export const ChannelLogLoader = memo(({ channel }: { channel: string }) => {
  const loaderEnabled = useAtomValue(loaderEnabledAtom)
  const logEvents = usePaginatedQuery(api.events.paginate, { channel }, { initialNumItems: 100 })

  const load100 = useCallback(() => {
    console.log('new load func')
    if (loaderEnabled) logEvents.loadMore(100)
  }, [loaderEnabled, logEvents])

  const setChannelEvents = useSetAtom(channelEventsAtom)
  useEffect(() => {
    setChannelEvents((prev) => {
      if (prev !== logEvents.results) {
        console.log('set', logEvents.results.length)
        return logEvents.results
      }
      console.log('no set')
    })
  }, [logEvents.results, setChannelEvents])

  const [loadMore, setLoadMore] = useAtom(requestLoadMoreAtom)
  useEffect(() => {
    setLoadMore((prev) => {
      if (prev) {
        if (logEvents.status === 'CanLoadMore') {
          console.log('load')
          load100()
          return true
        }
        console.log('stop')
        return false
      }
      console.log('skip')
      return false
    })
  }, [load100, loadMore, logEvents, setLoadMore])

  return (
    <div
      className={cn(
        'grid flex-none place-content-center place-items-center [&>*]:col-start-1 [&>*]:row-start-1',
        loadMore && 'bg-yellow-400',
      )}
      onClick={() => logEvents.loadMore(200)}
    >
      <Indicator n={logEvents.results.length} isLoading={logEvents.isLoading} />
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
