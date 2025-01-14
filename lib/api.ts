import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex-helpers/react/cache'

export { useQuery } from 'convex-helpers/react/cache'
export { useMutation } from 'convex/react'

export function useChannelQuery(channel: string) {
  return useQuery(api.v1.queries.channel, { channel })
}

export function useRecentActivityQuery(channel: string) {
  return useQuery(api.v1.queries.activity, { channel })
}

export function useAliasDataQuery(channel: string) {
  return useQuery(api.v1.queries.aliases, { channel })
}

export function useArtifactQuery(channel: string, alias: string) {
  return useQuery(api.v1.queries.artifact, { channel, alias })
}
