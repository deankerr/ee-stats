import { TableAggregate } from '@convex-dev/aggregate'
import { components, internal } from '../_generated/api'
import { DataModel, type Doc } from '../_generated/dataModel'
import { type MutationCtx } from '../_generated/server'
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
