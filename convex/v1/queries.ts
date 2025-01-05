import { asyncMap } from 'convex-helpers'
import { v } from 'convex/values'
import { ms } from 'itty-time'
import { query } from '../_generated/server'
import { aggregates_v1 } from './aggregates'

export const channel = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const count = await aggregates_v1.channel.timestamp.count(ctx, { namespace: channel, bounds: {} })
    const first = await aggregates_v1.channel.timestamp.min(ctx, { namespace: channel, bounds: {} })
    const latest = await aggregates_v1.channel.timestamp.max(ctx, { namespace: channel, bounds: {} })

    return {
      count,
      firstAt: first?.key,
      latestAt: latest?.key,
    }
  },
})

export const recent = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const namespace = channel
    const max = await aggregates_v1.channel.timestamp.max(ctx, { namespace, bounds: {} })
    const latestAt = max?.key

    // TODO
    if (!latestAt) return
    console.log('max', new Date(latestAt))
    const latestAtDate = new Date(latestAt)

    latestAtDate.setUTCHours(latestAtDate.getUTCHours() + 1, 0, 0, 0)

    const latestHourTime = latestAtDate.getTime()

    const hours = [...Array(24)].map((_, i) => i)
    const hourCounts = await asyncMap(hours, async (hour) => {
      const hourEnd = latestHourTime - ms('1 hour') * hour
      const hourStart = latestHourTime - ms('1 hour') * (hour + 1)
      return {
        hourStart,
        hourEnd,
        count: await aggregates_v1.channel.timestamp.count(ctx, {
          namespace,
          bounds: {
            upper: {
              key: hourEnd,
              inclusive: false,
            },
            lower: {
              key: hourStart,
              inclusive: true,
            },
          },
        }),
      }
    })

    return { last24Hours: hourCounts }
  },
})

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

    const total = await aggregates_v1.channel.timestamp.count(ctx, { namespace: channel, bounds: {} })
    const first = await aggregates_v1.channel.timestamp.min(ctx, { namespace: channel, bounds: {} })
    const latest = await aggregates_v1.channel.timestamp.max(ctx, { namespace: channel, bounds: {} })

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
      const count = await aggregates_v1.channel.hour_entryId.count(ctx, {
        namespace: channel,
        bounds: {
          prefix: [hour],
        },
      })

      hoursCount.set(hour, count)
    }

    return [...hoursCount]
  },
})
