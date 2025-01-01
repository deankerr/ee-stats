import { asyncMap, omit } from 'convex-helpers'
import { ConvexError, v } from 'convex/values'
import { mutation } from './_generated/server'
import { aggsOnInsert } from './aggregate'
import { getDistinctNicksForChannel } from './helpers'
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

    if (latest && firstArgLog.timestamp < latest.timestamp - 1) {
      throw new ConvexError({ message: 'log start is before current latest', entry: latest })
    }

    await asyncMap(logs, async (ev) => {
      const id = await ctx.db.insert('log_entries', { ...ev, channel })
      await aggsOnInsert(ctx, id)
    })
  },
})

export const populateLogUsers = mutation({
  args: {
    channel: v.string(),
  },
  handler: async (ctx, { channel }) => {
    const nickTimes = await getDistinctNicksForChannel(ctx, { channel })
    console.log(nickTimes)
    const nicks = nickTimes.map(({ nick }) => nick)

    const users = await ctx.db
      .query('log_users')
      .withIndex('channel', (q) => q.eq('channel', channel))
      .collect()

    const existingNicks = users.map(({ nick }) => nick)

    const newNicks = nicks.filter((nick) => !existingNicks.includes(nick))

    await asyncMap(newNicks, async (nick) => {
      await ctx.db.insert('log_users', { channel, nick })
      console.log('user:add', channel, nick)
    })

    return newNicks.length
  },
})
