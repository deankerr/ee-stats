import { TableAggregate } from '@convex-dev/aggregate'
import { Migrations } from '@convex-dev/migrations'
import { v } from 'convex/values'
import { components, internal } from './_generated/api'
import { DataModel, type Id } from './_generated/dataModel'
import { internalMutation, query, type MutationCtx } from './_generated/server'

export const aggNickActivity = new TableAggregate<{
  Namespace: string
  Key: [string, string]
  DataModel: DataModel
  TableName: 'log_entries'
}>(components.agg_nick_activity, {
  namespace: (doc) => doc.channel,
  sortKey: (doc) => [doc.nick, doc.type],
})

export const aggNSNickTimestamp = new TableAggregate<{
  Namespace: string
  Key: number
  DataModel: DataModel
  TableName: 'log_entries'
}>(components.agg_nsnick_timestamp, {
  namespace: (doc) => doc.nick,
  sortKey: (doc) => doc.timestamp,
})

export const aggregates = {
  channel: {
    timestamp: new TableAggregate<{
      Namespace: string
      Key: number
      DataModel: DataModel
      TableName: 'log_entries'
    }>(components.aggregate_channel_timestamp, {
      namespace: (doc) => doc.channel,
      sortKey: (doc) => doc.timestamp,
    }),
  },
}

export const aggsOnInsert = async (ctx: MutationCtx, id: Id<'log_entries'>) => {
  const log = await ctx.db.get(id)
  if (!log) return
  await aggNickActivity.insert(ctx, log)
  await aggNSNickTimestamp.insert(ctx, log)
  await aggregates.channel.timestamp.insert(ctx, log)
}

// export const getAggs = query({
//   args: {
//     dayOf: v.optional(v.number()),
//   },
//   handler: async (ctx, { dayOf = 1735748736342 }) => {
//     const lower = new Date(dayOf)
//     lower.setUTCHours(0, 0, 0, 0)

//     const upper = new Date(lower)
//     upper.setUTCDate(upper.getUTCDate() + 1)

//     const total = await aggregates.channel.timestamp.count(ctx, { namespace: 'cupcake', bounds: {} })
//     return total
//   },
// })

// * migrations
export const migrations = new Migrations<DataModel>(components.migrations)
export const run = migrations.runner()

export const backfillAggregatesMigration = migrations.define({
  table: 'log_entries',
  migrateOne: async (ctx, doc) => {
    // await aggNickActivity.insertIfDoesNotExist(ctx, doc)
    // await aggNSNickTimestamp.insertIfDoesNotExist(ctx, doc)
    await aggregates.channel.timestamp.insertIfDoesNotExist(ctx, doc)
  },
})

export const clearAggregates = internalMutation({
  args: {
    namespace: v.string(),
  },
  handler: async (ctx, { namespace }) => {
    await aggNickActivity.clear(ctx, { namespace })
    // await aggNSNickTimestamp.clearAll(ctx, { namespace })
  },
})

// This is what you can run, from the Convex dashboard or with `npx convex run`,
// to backfill aggregates for existing leaderboard entries, if you created the
// leaderboard before adding the aggregate components.
export const runAggregateBackfill = migrations.runner(internal.aggregate.backfillAggregatesMigration)
