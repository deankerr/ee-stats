import { TableAggregate, type Item } from '@convex-dev/aggregate'
import { asyncMap } from 'convex-helpers'
import { ConvexError, v } from 'convex/values'
import { components, internal } from '../_generated/api'
import { DataModel, type Id } from '../_generated/dataModel'
import { internalMutation } from '../_generated/server'
import { migrations } from '../migrations'

export const aggregatesv1 = {
  channel: {
    timestamp: new TableAggregate<{
      Namespace: string
      Key: number
      DataModel: DataModel
      TableName: 'v1_log_entries'
    }>(components.v1_aggregate_channel_timestamp, {
      namespace: (doc) => doc.channel,
      sortKey: (doc) => doc.timestamp,
    }),
  },

  alias: {
    channel_timestamp: new TableAggregate<{
      Namespace: string
      Key: [string, number]
      DataModel: DataModel
      TableName: 'v1_log_entries'
    }>(components.v1_aggregate_alias_channel_timestamp, {
      namespace: (doc) => doc.alias,
      sortKey: (doc) => [doc.channel, doc.timestamp],
    }),
  },
}

export const processAliasStats = internalMutation({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const aliases: string[] = []

    for await (const alias of aggregatesv1.alias.channel_timestamp.iterNamespaces(ctx, 50)) {
      aliases.push(alias)
    }
    console.log('aliases', aliases)

    await asyncMap(aliases, async (alias) => {
      const count = await aggregatesv1.alias.channel_timestamp.count(ctx, {
        namespace: alias,
        bounds: { prefix: [channel] },
      })

      const first = await aggregatesv1.alias.channel_timestamp.min(ctx, {
        namespace: alias,
        bounds: { prefix: [channel] },
      })

      const latest = await aggregatesv1.alias.channel_timestamp.max(ctx, {
        namespace: alias,
        bounds: { prefix: [channel] },
      })

      const random = await aggregatesv1.alias.channel_timestamp.random(ctx, {
        namespace: alias,
        bounds: { prefix: [channel] },
      })

      await ctx.db.insert('v1_log_alias_stats', {
        channel,
        alias,
        count,
        first: transformAggItem(first),
        latest: transformAggItem(latest),
        random: transformAggItem(random),
      })
      console.log('alias data', alias)
    })
  },
})

function transformAggItem(item: Item<[string, number], Id<'v1_log_entries'>> | null) {
  if (!item) throw new ConvexError({ message: 'invalid aggregate item' })
  return { id: item.id, timestamp: item.key[1] }
}

export const backfillAggregatesMigration = migrations.define({
  table: 'v1_log_entries',
  migrateOne: async (ctx, doc) => {
    await aggregatesv1.channel.timestamp.insertIfDoesNotExist(ctx, doc)
    await aggregatesv1.alias.channel_timestamp.insertIfDoesNotExist(ctx, doc)
  },
})

export const run_backfillAggregatesMigration = migrations.runner(
  internal.v1.aggregates.backfillAggregatesMigration,
)
