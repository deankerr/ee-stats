import { LogEntry } from '@/convex/logs'
import { atom } from 'jotai'

export const channelEventItemsAtom = atom<LogEntry[]>()
export const requestLoadMoreAtom = atom(false)
