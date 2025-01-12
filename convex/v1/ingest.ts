import { asyncMap, omit } from 'convex-helpers'
import { v } from 'convex/values'
import { mutation } from '../_generated/server'
import schema from '../schema'
import { aggregates_v1 } from './aggregates'
import { updateAliasData } from './aliases'

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
