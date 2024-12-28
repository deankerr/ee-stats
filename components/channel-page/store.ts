import { LogEventItem } from '@/convex/events'
import { atom } from 'jotai'

export const channelEventItemsAtom = atom<LogEventItem[]>()
export const requestLoadMoreAtom = atom(false)
