import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex-helpers/react/cache'

export { useQuery } from 'convex-helpers/react/cache'
export { useMutation } from 'convex/react'

export function useChannelQuery(channel: string) {
  return useQuery(api.v1.queries.channel, { channel })
}

export function useRecentActivityQuery(channel: string) {
  return useQuery(api.v1.queries.recent, { channel })
}
