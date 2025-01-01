import type { QueryCtx } from './_generated/server'

export async function getDistinctNicksForChannel(ctx: QueryCtx, { channel }: { channel: string }) {
  const nicksN = new Map<string, number>()

  let doc = await ctx.db
    .query('log_entries')
    .withIndex('channel_nick', (q) => q.eq('channel', channel))
    .first()

  while (doc !== null) {
    const nick = doc.nick
    nicksN.set(nick, doc.timestamp)
    doc = await ctx.db
      .query('log_entries')
      .withIndex('channel_nick', (q) => q.eq('channel', channel).gt('nick', nick))
      .first()
  }

  const result = [...nicksN].map(([nick, firstTimestamp]) => ({ nick, firstTimestamp }))
  return result
}
