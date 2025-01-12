import { DirectAggregate, TableAggregate } from '@convex-dev/aggregate'
import { v } from 'convex/values'
import { components, internal } from '../_generated/api'
import { DataModel, type Doc, type Id } from '../_generated/dataModel'
import { internalMutation, type MutationCtx } from '../_generated/server'
import { migrations } from '../migrations'

export const aggregates_v1 = {
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

    hour_entryId: new DirectAggregate<{
      Namespace: string
      Key: [number]
      Id: Id<'v1_log_entries'>
      DataModel: DataModel
    }>(components.v1_aggregate_channel_hour_entryId),

    hour_entryId_helper: async (
      ctx: MutationCtx,
      {
        namespace,
        timestamp,
        logEntryId,
      }: { namespace: string; timestamp: number; logEntryId: Id<'v1_log_entries'> },
    ) => {
      const hour = new Date(timestamp).getUTCHours()
      await aggregates_v1.channel.hour_entryId.insert(ctx, { namespace, key: [hour], id: logEntryId })
    },
  },

  insert: async (ctx: MutationCtx, doc: Doc<'v1_log_entries'>) => {
    await aggregates_v1.channel.timestamp.insert(ctx, doc)
    await aggregates_v1.alias.channel_timestamp.insert(ctx, doc)
  },
}

export const backfillAggregatesMigration = migrations.define({
  table: 'v1_log_entries',
  migrateOne: async (ctx, doc) => {
    await aggregates_v1.channel.timestamp.insertIfDoesNotExist(ctx, doc)
    await aggregates_v1.alias.channel_timestamp.insertIfDoesNotExist(ctx, doc)
  },
})

export const run_backfillAggregatesMigration = migrations.runner(
  internal.v1.aggregates.backfillAggregatesMigration,
)

export const migrateNewChannelTimestampAggregate = migrations.define({
  table: 'v1_log_entries',
  customRange: (q) => q.withIndex('channel', (q) => q.eq('channel', 'rawr')),
  migrateOne: async (ctx, doc) => {
    await aggregates_v1.channel.timestamp.insert(ctx, doc)
  },
})

export const run_migrateNewChannelTimestampAggregate = migrations.runner(
  internal.v1.aggregates.migrateNewChannelTimestampAggregate,
)

export const clearAggregates = internalMutation({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    // const aliases:string[] = []

    // for await (const alias of aggregates_v1.alias.channel_timestamp.iterNamespaces(ctx)) {
    //   aliases.push(alias)

    // }

    await aggregates_v1.alias.channel_timestamp.clearAll(ctx, {})
    await aggregates_v1.channel.timestamp.clear(ctx, { namespace: channel })
    await aggregates_v1.channel.hour_entryId.clear(ctx, { namespace: channel })
  },
})
