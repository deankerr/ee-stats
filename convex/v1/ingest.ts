import { asyncMap, omit } from 'convex-helpers'
import { v } from 'convex/values'
import { mutation } from '../_generated/server'
import schema from '../schema'

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
