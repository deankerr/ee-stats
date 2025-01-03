import { asyncMap, omit } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { query } from './_generated/server'
import { aggNickActivity, aggNSNickTimestamp, aggregates } from './aggregate'
import { getDistinctNicksForChannel } from './helpers'
import type { LogEntry } from './types'

function transformLogEntry(logEntry: Doc<'log_entries'>): LogEntry {
  return {
    ...omit(logEntry, ['_id', '_creationTime', 'category', 'channel']),
    id: logEntry._id,
  }
}

export const list = query({
  args: {
    channel: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { channel, limit = 20 }) => {
    const result = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .take(Math.min(limit, 100))
    return result.reverse().map(transformLogEntry)
  },
})

export const paginate = query({
  args: {
    channel: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { channel, paginationOpts }) => {
    const result = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .paginate(paginationOpts)
    return { ...result, page: result.page.map(transformLogEntry) }
  },
})

export const getPage = query({
  args: {
    channel: v.string(),
    offset: v.number(),
    numItems: v.number(),
  },
  handler: async (ctx, { offset, numItems, channel }) => {
    const { key: pageStart } = await aggregates.channel.timestamp.at(ctx, offset, {
      namespace: channel,
    })

    const results = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel).gte('timestamp', pageStart))
      .take(numItems)

    return results.map(transformLogEntry)
  },
})

export const getPageFor = query({
  args: {
    channel: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, { channel, timestamp }) => {
    const rangeBefore = 10
    const rangeAfter = 40
    const index = await aggregates.channel.timestamp.indexOf(ctx, timestamp, { namespace: channel })

    const { key: pageStart } = await aggregates.channel.timestamp.at(ctx, index - rangeBefore, {
      namespace: channel,
    })

    const results = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel).gte('timestamp', pageStart))
      .take(rangeBefore + rangeAfter + 1)

    return results.map(transformLogEntry)
  },
})

export const search = query({
  args: {
    channel: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('log_entries')
      .withSearchIndex('messages', (q) =>
        q.search('content', args.value).eq('channel', args.channel).eq('category', 'message'),
      )
      .take(50)

    return result.map(transformLogEntry)
  },
})

export const nicks = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    return await getDistinctNicksForChannel(ctx, { channel })
  },
})

export const activity = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const namespace = channel
    const total = await aggNickActivity.count(ctx, { namespace, bounds: {} })

    const users = await ctx.db
      .query('log_users')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .collect()

    const result = {
      total,
      nicks: await asyncMap(users, async ({ nick }) => ({
        nick,
        total: await aggNSNickTimestamp.count(ctx, {
          namespace: nick,
          bounds: {},
        }),
      })),
    }

    result.nicks.sort((a, b) => b.total - a.total)
    return result
  },
})
