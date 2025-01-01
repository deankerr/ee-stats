import type { Doc, Id } from './_generated/dataModel'

export type LogEntry = Omit<Doc<'log_entries'>, '_id' | '_creationTime' | 'category' | 'channel'> & {
  id: Id<'log_entries'>
}
