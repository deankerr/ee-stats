import { asyncMap } from 'convex-helpers'
import { query } from '../_generated/server'
import { v } from '../common'
import { aggregates_v1 } from './aggregates'
import { vArtifacts } from './artifacts'
import { getHourBoundsFrom } from './utils'

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

export const activity = query({
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

    return { hours: activityPerHour }
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

    return {
      aliases: aliasesWithQuote.sort((a, b) => b.count - a.count),
    }
  },
})

export const artifact = query({
  args: {
    channel: v.string(),
    alias: v.string(),
  },
  returns: v.object({
    wordCloud: v.nullable(vArtifacts.word_cloud),
  }),

  handler: async (ctx, { channel, alias }) => {
    const wordCloud = await ctx.db
      .query('v1_channel_artifacts')
      .withIndex('channel_alias', (q) => q.eq('channel', channel).eq('alias', alias))
      .order('desc')
      .filter((q) => q.eq(q.field('type'), 'word_cloud'))
      .first()

    return {
      wordCloud,
    }
  },
})
