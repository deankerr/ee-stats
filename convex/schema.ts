import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  log_entries: defineTable({
    channel: v.string(),
    timestamp: v.number(),
    category: v.union(v.literal('message'), v.literal('status')),
    type: v.string(),
    prefix: v.string(),
    nick: v.string(),
    content: v.string(),
  })
    .index('channel', ['channel', 'timestamp'])
    .index('channel_nick', ['channel', 'nick', 'timestamp'])
    .searchIndex('messages', {
      searchField: 'content',
      filterFields: ['channel', 'timestamp', 'category', 'type', 'nick'],
    }),

  log_users: defineTable({
    channel: v.string(),
    nick: v.string(),
    alias: v.optional(v.string()),
  }).index('channel', ['channel']),
})
