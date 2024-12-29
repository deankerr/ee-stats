import { TableAggregate } from '@convex-dev/aggregate'
import { asyncMap, omit } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import type { DataModel, Doc } from './_generated/dataModel'
import { internalMutation, mutation, query } from './_generated/server'
import schema from './schema'
import { components, internal } from './_generated/api'
import { EVENT_NAMES } from './constants'
import { Migrations } from '@convex-dev/migrations'

export type LogEntry = Doc<'log_entries'>

// * aggregates
const aggTypeNick = new TableAggregate<{
  Key: [string, string]
  DataModel: DataModel
  TableName: 'log_entries'
}>(components.aggTypeNick, {
  sortKey: (d) => [d.type, d.nick],
})

const aggNickTypeTime = new TableAggregate<{
  Key: [string, string, number]
  DataModel: DataModel
  TableName: 'log_entries'
}>(components.aggNickTypeTime, {
  sortKey: (d) => [d.nick, d.type, d.timestamp],
})

const aggNickTime = new TableAggregate<{
  Key: [string, number]
  DataModel: DataModel
  TableName: 'log_entries'
}>(components.aggNickTime, {
  sortKey: (d) => [d.nick, d.timestamp],
})

const aggTimeNick = new TableAggregate<{
  Key: [number, string]
  DataModel: DataModel
  TableName: 'log_entries'
}>(components.aggTimeNick, {
  sortKey: (d) => [d.timestamp, d.nick],
})

// * mutations/queries

const vLogAdd = v.object(omit(schema.tables.log_entries.validator.fields, ['channel']))
export const add = mutation({
  args: {
    channel: v.string(),
    logs: v.array(vLogAdd),
  },
  handler: async (ctx, { channel, logs }) => {
    const latest = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .first()

    const latestTimestamp = latest?.timestamp ?? 0

    await asyncMap(logs, async (ev) => {
      if (ev.timestamp < latestTimestamp) throw new Error('Timestamp is less than latest timestamp')
      const id = await ctx.db.insert('log_entries', { ...ev, channel })
      const doc = (await ctx.db.get(id))!

      await aggTypeNick.insert(ctx, doc)
      await aggNickTypeTime.insert(ctx, doc)
      await aggNickTime.insert(ctx, doc)
      await aggTimeNick.insert(ctx, doc)
    })
  },
})

const nicks = ['']

export const count = query({
  args: {
    nicks: v.array(v.string()),
  },
  handler: async (ctx) => {
    return {
      aggTypeNick: {
        nicks: await asyncMap(nicks, async (nick) => ({
          _nick: nick,
          ev: Object.fromEntries(
            await asyncMap(EVENT_NAMES, async (ev) => [
              ev,
              await aggTypeNick.count(ctx, { bounds: { prefix: [ev, nick] } }),
            ]),
          ),
        })),
        all: await aggTypeNick.count(ctx, { bounds: {} }),
        messages: await aggTypeNick.count(ctx, { bounds: { prefix: ['message'] } }),
      },
    }
  },
})

export const countNicks = query(async (ctx) => {
  return {
    total: await aggTypeNick.count(ctx, { bounds: {} }),

    nicks: await asyncMap(nicks, async (nick) => ({
      _nick: nick,
      messages: await aggNickTypeTime.count(ctx, { bounds: { prefix: [nick, 'message'] } }),
      all: await aggNickTypeTime.count(ctx, { bounds: { prefix: [nick] } }),
    })),
  }
})

export const NickTime = query(async (ctx) => {
  const result = {
    total: await aggNickTime.count(ctx),
  }

  return result
})

export const timeNick = query(async (ctx) => {
  await aggTimeNick.random(ctx)
  // @ts-expect-error afafaf
  const res = await aggTimeNick.count(ctx, {
    bounds: {
      lower: { key: [1725503689399], inclusive: false },
      upper: { key: [1735464989103], inclusive: true },
    },
    namespace: undefined,
  })
  return res
})

export const getLatest = query({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const result = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .first()
    return result
  },
})

export const list = query({
  args: {
    channel: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { channel, limit = 20 }) => {
    const result = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .take(Math.min(limit, 100))
    return result.reverse()
  },
})

export const paginate = query({
  args: {
    channel: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { channel, paginationOpts }) => {
    const result = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .paginate(paginationOpts)
    return result
  },
})

export const search = query({
  args: {
    channel: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('log_entries')
      .withSearchIndex('messages', (q) =>
        q.search('content', args.value).eq('channel', args.channel).eq('category', 'message'),
      )
      .take(50)

    return result
  },
})

// * migrations

export const migrations = new Migrations<DataModel>(components.migrations)
export const run = migrations.runner()

export const backfillAggregatesMigration = migrations.define({
  table: 'log_entries',
  migrateOne: async (ctx, doc) => {
    await aggTypeNick.insertIfDoesNotExist(ctx, doc)
    await aggNickTypeTime.insertIfDoesNotExist(ctx, doc)
    await aggNickTime.insertIfDoesNotExist(ctx, doc)
    await aggTimeNick.insertIfDoesNotExist(ctx, doc)
  },
})

export const clearAggregates = internalMutation({
  args: {},
  handler: async (ctx) => {
    await aggTypeNick.clear(ctx)
    await aggNickTypeTime.clear(ctx)
    await aggNickTime.clear(ctx)
    await aggTimeNick.clear(ctx)
  },
})

// This is what you can run, from the Convex dashboard or with `npx convex run`,
// to backfill aggregates for existing leaderboard entries, if you created the
// leaderboard before adding the aggregate components.
export const runAggregateBackfill = migrations.runner(internal.logs.backfillAggregatesMigration)
