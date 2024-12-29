import { asyncMap, omit } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
import schema from './schema'

export type LogEntry = Doc<'log_entries'>

const vLogAdd = v.object(omit(schema.tables.log_entries.validator.fields, ['channel']))
export const add = mutation({
  args: {
    channel: v.string(),
    logs: v.array(vLogAdd),
  },
  handler: async (ctx, { channel, logs }) => {
    const latest = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .first()

    const latestTimestamp = latest?.timestamp ?? 0

    await asyncMap(logs, async (ev) => {
      if (ev.timestamp < latestTimestamp) throw new Error('Timestamp is less than latest timestamp')
      await ctx.db.insert('log_entries', { ...ev, channel })
    })
  },
})

export const getLatest = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const result = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .first()
    return result
  },
})

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
    return result.reverse()
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
    return result
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

    return result
  },
})
