import type { Item } from '@convex-dev/aggregate'
import { asyncMap, omit } from 'convex-helpers'
import { ConvexError, v } from 'convex/values'
import type { Id } from '../_generated/dataModel'
import { mutation, type MutationCtx } from '../_generated/server'
import schema from '../schema'
import { aggregates_v1 } from './aggregates'

const vLogEntriesFields = schema.tables.v1_log_entries.validator.fields
const vAddLogEntry = { ...omit(vLogEntriesFields, ['channel']) }

export const addMany = mutation({
  args: {
    channel: v.string(),
    logEntries: v.array(v.object(vAddLogEntry)),
  },
  handler: async (ctx, { channel, logEntries }) => {
    await asyncMap(logEntries, async (entry) => {
      await ctx.db.insert('v1_log_entries', { ...entry, channel })
    })
  },
})

export const entry = mutation({
  args: vLogEntriesFields,

  handler: async (ctx, args) => {
    const id = await ctx.db.insert('v1_log_entries', args)
    const doc = await ctx.db.get(id)
    if (doc) {
      await aggregates_v1.insert(ctx, doc)
      // await updateAliasData(ctx, { channel: doc.channel, alias: doc.alias })
    }
  },
})

export const artifact = mutation({
  args: {
    channel: v.string(),
    alias: v.optional(v.string()),
    type: v.string(),
    content: v.any(),
  },
  handler: async (ctx, { channel, alias, type, content }) => {
    await ctx.db.insert('v1_channel_artifacts', { channel, alias, type, content })
  },
})

export const maintenance = mutation({
  args: {
    channel: v.string(),
    alias: v.string(),
  },
  handler: async (ctx, { channel, alias }) => {
    await updateAliasData(ctx, { channel, alias })
  },
})

async function updateAliasData(ctx: MutationCtx, { channel, alias }: { channel: string; alias: string }) {
  try {
    const bounds = {
      namespace: alias,
      bounds: { prefix: [channel] as [string] },
    }

    const items = [
      aggregates_v1.alias.channel_timestamp.min(ctx, bounds),
      aggregates_v1.alias.channel_timestamp.max(ctx, bounds),
      aggregates_v1.alias.channel_timestamp.random(ctx, bounds),
    ] as const

    const [first, latest, random] = await Promise.all(items)

    const stats = {
      count: await aggregates_v1.alias.channel_timestamp.count(ctx, bounds),
      first: transformAggItem(first),
      latest: transformAggItem(latest),
      random: transformAggItem(random),
    }

    const existing = await ctx.db
      .query('v1_log_alias_stats')
      .withIndex('alias', (q) => q.eq('alias', alias))
      .filter((q) => q.eq(q.field('channel'), channel))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, stats)
    } else {
      await ctx.db.insert('v1_log_alias_stats', {
        channel,
        alias,
        ...stats,
      })
    }
  } catch (err) {
    console.error(alias, err)
  }
}

function transformAggItem(item: Item<[string, number], Id<'v1_log_entries'>> | null) {
  if (!item) throw new ConvexError({ message: 'invalid aggregate item' })
  return { id: item.id, timestamp: item.key[1] }
}
