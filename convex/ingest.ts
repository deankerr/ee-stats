import { asyncMap, omit } from 'convex-helpers'
import { v } from 'convex/values'
import { mutation } from './_generated/server'
import schema from './schema'

const vLogAdd = v.object(omit(schema.tables.log_entries.validator.fields, ['channel']))
export const add = mutation({
  args: {
    channel: v.string(),
    logs: v.array(vLogAdd),
  },
  handler: async (ctx, { channel, logs }) => {
    const firstArgLog = logs[0]
    if (!firstArgLog) return

    const latest = await ctx.db
      .query('log_entries')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .order('desc')
      .first()

    if (latest && firstArgLog.timestamp > latest.timestamp - 1) {
      throw new Error('log start is before current latest')
    }

    await asyncMap(logs, async (ev) => {
      await ctx.db.insert('log_entries', { ...ev, channel })
    })
  },
})
