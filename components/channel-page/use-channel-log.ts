import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { usePaginatedQuery } from 'convex/react'
import { useCallback } from 'react'

const initialNumItems = 500
const loadMoreNumItems = 20

export function useChannelLog(channel: string) {
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.queries.paginate,
    { channel },
    { initialNumItems },
  )

  const loadNext = useCallback(() => {
    loadMore(loadMoreNumItems)
    console.log('load', loadMoreNumItems)
  }, [loadMore])

  return { results, isLoading, loadNext, status }
}

export function dummyEntries(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    _id: `dummy-${i}` as Id<'log_entries'>,
    _creationTime: Date.now() - i,
    timestamp: Date.now() - i,
    category: 'message' as const,
    type: 'message',
    content: `Dummy message ${i}`,
    prefix: '$',
    nick: 'dumdum',
    channel: '#dumdums',
  }))
}
