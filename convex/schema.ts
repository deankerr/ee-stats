import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  v1_log_entries: defineTable({
    channel: v.string(),
    timestamp: v.number(),
    event: v.string(),
    significant: v.boolean(),
    prefix: v.string(),
    nick: v.string(),
    content: v.string(),
    alias: v.string(),
  })
    .index('channel', ['channel', 'timestamp'])
    .index('channel_alias', ['channel', 'alias'])
    .searchIndex('activity', {
      searchField: 'content',
      filterFields: ['channel', 'timestamp', 'event', 'significant', 'alias'],
    }),

  v1_log_alias_stats: defineTable({
    channel: v.string(),
    alias: v.string(),
    count: v.number(),

    first: v.object({
      id: v.id('v1_log_entries'),
      timestamp: v.number(),
    }),

    latest: v.object({
      id: v.id('v1_log_entries'),
      timestamp: v.number(),
    }),

    random: v.object({
      id: v.id('v1_log_entries'),
      timestamp: v.number(),
    }),
  })
    .index('alias', ['alias'])
    .index('channel', ['channel']),
})
