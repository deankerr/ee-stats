import { asyncMap, omit } from 'convex-helpers'
import { v } from 'convex/values'
import { mutation } from '../_generated/server'
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
    if (doc) await aggregates_v1.insert(ctx, doc)
  },
})
