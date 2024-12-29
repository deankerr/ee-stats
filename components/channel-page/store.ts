import { LogEntry } from '@/convex/types'
import { atom } from 'jotai'

export const channelEventItemsAtom = atom<LogEntry[]>()
export const requestLoadMoreAtom = atom(false)
