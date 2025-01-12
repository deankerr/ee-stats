import type { Item } from '@convex-dev/aggregate'
import { ConvexError, v } from 'convex/values'
import { internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { action, internalMutation, type MutationCtx } from '../_generated/server'
import { aggregates_v1 } from './aggregates'

export const patchEntryAlias = internalMutation({
  args: {
    entryId: v.id('v1_log_entries'),
    alias: v.string(),
  },
  handler: async (ctx, { entryId, alias }) => {
    const entry = await ctx.db.get(entryId)
    if (!entry) throw new ConvexError('invalid entry id')
    console.log('entry:', entry, 'new alias:', alias)

    await ctx.db.patch(entryId, { alias })
    await aggregates_v1.alias.channel_timestamp.replace(ctx, entry, { ...entry, alias })
  },
})

export const materializeAliasStats = internalMutation({
  args: {
    channel: v.string(),
    alias: v.string(),
  },
  handler: async (ctx, args) => {
    await updateAliasData(ctx, args)
  },
})

export const associateLogEntriesWithAlias = action({
  args: {
    channel: v.string(),
    alias: v.string(),
    nicks: v.array(v.string()),
  },
  handler: async (ctx, { channel, alias, nicks }) => {
    for (const nick of nicks) {
      console.log('alias:', nick, '->', alias)
      const bounds = {
        namespace: nick,
        bounds: {
          prefix: [channel] as [string],
        },
      }

      for await (const item of aggregates_v1.alias.channel_timestamp.iter(ctx, bounds)) {
        await ctx.runMutation(internal.v1.aliases.patchEntryAlias, { entryId: item.id, alias })
      }

      await ctx.runMutation(internal.v1.aliases.materializeAliasStats, { channel, alias: nick })
    }

    await ctx.runMutation(internal.v1.aliases.materializeAliasStats, { channel, alias })
  },
})

export async function updateAliasData(
  ctx: MutationCtx,
  { channel, alias }: { channel: string; alias: string },
) {
  const existing = await ctx.db
    .query('v1_log_alias_stats')
    .withIndex('alias', (q) => q.eq('alias', alias))
    .filter((q) => q.eq(q.field('channel'), channel))
    .first()

  console.log('updateAliasData', channel, alias, existing?._id)
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
    if (err instanceof ConvexError && err.data.message === 'invalid aggregate item' && existing) {
      console.log('removing alias record')
      await ctx.db.delete(existing._id)
    }
  }
}

function transformAggItem(item: Item<[string, number], Id<'v1_log_entries'>> | null) {
  if (!item) throw new ConvexError({ message: 'invalid aggregate item' })
  return { id: item.id, timestamp: item.key[1] }
}
