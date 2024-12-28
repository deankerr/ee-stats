import { LogEventItem } from '@/convex/events'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const channelEventItemsAtom = atom<LogEventItem[]>()
export const requestLoadMoreAtom = atom(false)
export const loaderEnabledAtom = atomWithStorage('loaderEnabled', true)
