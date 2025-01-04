import { asyncMap } from 'convex-helpers'
import { v } from 'convex/values'
import { query } from '../_generated/server'
import { aggregatesv1 } from './aggregates'

export const activity = query({
  args: {
    channel: v.string(),
  },

  handler: async (ctx, { channel }) => {
    const aliases = await ctx.db
      .query('v1_log_alias_stats')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .collect()

    const aliasesWithQuote = await asyncMap(aliases, async (stats) => {
      const quote = await ctx.db.get(stats.random.id)
      return {
        ...stats,
        random: quote || stats.random,
      }
    })

    const total = await aggregatesv1.channel.timestamp.count(ctx, { namespace: channel, bounds: {} })
    const first = await aggregatesv1.channel.timestamp.min(ctx, { namespace: channel, bounds: {} })
    const latest = await aggregatesv1.channel.timestamp.max(ctx, { namespace: channel, bounds: {} })

    return {
      total,
      firstTimestamp: first?.key,
      latestTimestamp: latest?.key,
      aliases: aliasesWithQuote.sort((a, b) => b.count - a.count),
    }
  },
})

export const channelActivity = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const hoursCount: Map<number, number> = new Map([...Array(24)].map((_, i) => [i, 0]))

    for (const hour of hoursCount.keys()) {
      const count = await aggregatesv1.channel.hour_entryId.count(ctx, {
        namespace: channel,
        bounds: {
          prefix: [hour],
        },
      })

      hoursCount.set(hour, count)
    }

    console.log(hoursCount)
    return [...hoursCount]
  },
})
