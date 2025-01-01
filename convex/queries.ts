import { asyncMap } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { query } from './_generated/server'
import { aggNickActivity } from './aggregate'
import { EVENT_NAMES } from './constants'
import { getDistinctNicksForChannel } from './helpers'

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
      nicks: await asyncMap(users, async ({ nick }) => {
        return {
          nick: nick,
          total: await aggNickActivity.count(ctx, { namespace, bounds: { prefix: [nick] } }),
          events: await asyncMap(EVENT_NAMES, async (event) => {
            return {
              event,
              count: await aggNickActivity.count(ctx, { namespace, bounds: { prefix: [nick, event] } }),
            }
          }).then((events) => events.filter((ev) => ev.count)),
        }
      }),
    }

    result.nicks.sort((a, b) => b.total - a.total)
    return result
  },
})
