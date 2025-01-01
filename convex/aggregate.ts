import { TableAggregate } from '@convex-dev/aggregate'
import { Migrations } from '@convex-dev/migrations'
import { asyncMap } from 'convex-helpers'
import { v } from 'convex/values'
import { components, internal } from './_generated/api'
import { DataModel, type Id } from './_generated/dataModel'
import { internalMutation, query, type MutationCtx } from './_generated/server'
import { EVENT_NAMES } from './constants'

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

export const aggsOnInsert = async (ctx: MutationCtx, id: Id<'log_entries'>) => {
  const log = await ctx.db.get(id)
  if (!log) return
  await aggNickActivity.insert(ctx, log)
  await aggNSNickTimestamp.insert(ctx, log)
}

export const getAggs = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const namespace = channel
    const total = await aggNickActivity.count(ctx, { namespace, bounds: {} })

    const users = await ctx.db
      .query('log_users')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .collect()

    return {
      _total: total,
      nicks: await asyncMap(users, async ({ nick }) => {
        return {
          _nick: nick,
          _total: await aggNickActivity.count(ctx, { namespace, bounds: { prefix: [nick] } }),
          events: await asyncMap(EVENT_NAMES, async (event) => {
            return {
              event,
              count: await aggNickActivity.count(ctx, { namespace, bounds: { prefix: [nick, event] } }),
            }
          }).then((events) => events.filter((ev) => ev.count)),
        }
      }),
    }
  },
})

// * migrations
export const migrations = new Migrations<DataModel>(components.migrations)
export const run = migrations.runner()

export const backfillAggregatesMigration = migrations.define({
  table: 'log_entries',
  migrateOne: async (ctx, doc) => {
    await aggNickActivity.insertIfDoesNotExist(ctx, doc)
    await aggNSNickTimestamp.insertIfDoesNotExist(ctx, doc)
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
