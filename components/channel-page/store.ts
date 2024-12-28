import { LogEvent } from '@/convex/events'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const channelEventsAtom = atom<LogEvent[]>()
export const requestLoadMoreAtom = atom(false)
export const loaderEnabledAtom = atomWithStorage('loaderEnabled', true)
