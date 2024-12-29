import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  irc_logs: defineTable({
    channel: v.string(),
    timestamp: v.number(),
    category: v.union(v.literal('message'), v.literal('status')),
    type: v.string(),
    prefix: v.optional(v.string()),
    nick: v.string(),
    content: v.string(),
  })
    .index('channel', ['channel', 'timestamp'])
    .searchIndex('messages', {
      searchField: 'content',
      filterFields: ['channel', 'timestamp', 'category', 'type', 'nick'],
    }),
})
