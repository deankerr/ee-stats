import { asyncMap } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
import schema from './schema'

export type LogEventItem = Doc<'events'>

export const add = mutation({
  args: {
    events: v.array(schema.tables.events.validator),
  },
  handler: async (ctx, { events }) => {
    await asyncMap(events, async (ev) => await ctx.db.insert('events', ev))
    return events.length
  },
})

export const getLatest = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const result = await ctx.db
      .query('events')
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
      .query('events')
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
      .query('events')
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
      .query('events')
      .withSearchIndex('messages', (q) =>
        q.search('content', args.value).eq('channel', args.channel).eq('category', 'message'),
      )
      .take(50)

    return result
  },
})
