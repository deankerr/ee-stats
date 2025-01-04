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

  v1_log_users: defineTable({
    name: v.string(),
  }).index('name', ['name']),

  v1_log_user_aliases: defineTable({
    nick: v.string(),
    logUserId: v.id('v1_log_users'),
  })
    .index('logUserId', ['logUserId'])
    .index('nick', ['nick']),
})
