import { LogItem } from '@/convex/logs'
import { atom } from 'jotai'

export const channelEventItemsAtom = atom<LogItem[]>()
export const requestLoadMoreAtom = atom(false)
