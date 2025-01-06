import { asyncMap } from 'convex-helpers'
import { v } from 'convex/values'
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
    if (!latestAt) return null

    const activityPerHour = await asyncMap(
      getHourBoundsFrom(latestAt, 72),
      async ({ timeFrom, timeTo, bounds }) => ({
        timeFrom,
        timeTo,
        count: await aggregates_v1.channel.timestamp.count(ctx, {
          namespace,
          bounds,
        }),
      }),
    )

    const activityPerDay = await asyncMap(
      getDayBoundsFrom(latestAt, 30),
      async ({ timeFrom, timeTo, bounds }) => ({
        timeFrom,
        timeTo,
        count: await aggregates_v1.channel.timestamp.count(ctx, {
          namespace,
          bounds,
        }),
      }),
    )

    return { hours: activityPerHour, days: activityPerDay }
  },
})

export const aliases = query({
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

function getHourBoundsFrom(time: number, hours: number) {
  const date = new Date(time)
  date.setUTCHours(date.getUTCHours() - hours + 1, 0, 0, 0)

  return [...Array(hours)].map(() => {
    const timeFrom = date.getTime()
    date.setHours(date.getHours() + 1)
    const timeTo = date.getTime()

    return {
      timeFrom,
      timeTo,
      bounds: {
        lower: {
          key: timeFrom,
          inclusive: true,
        },
        upper: {
          key: timeTo,
          inclusive: false,
        },
      },
    }
  })
}

function getDayBoundsFrom(time: number, days: number) {
  const date = new Date(time)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - days + 1)

  return [...Array(days)].map(() => {
    const timeFrom = date.getTime()
    date.setDate(date.getDate() + 1)
    const timeTo = date.getTime()

    return {
      timeFrom,
      timeTo,
      bounds: {
        lower: {
          key: timeFrom,
          inclusive: true,
        },
        upper: {
          key: timeTo,
          inclusive: false,
        },
      },
    }
  })
}
