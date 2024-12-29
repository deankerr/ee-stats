import * as fs from 'node:fs'
import { ConvexClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { chunk } from 'remeda'
import type { WithoutSystemFields } from 'convex/server'

type IRCEvent = WithoutSystemFields<Doc<'irc_logs'>>

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)

const channel = process.argv[3]
const batchSize = 5000

async function main() {
  const path = process.argv[2]
  const limit = Number.parseInt(process.argv[4]) || -1
  const lines = chunk(
    fs.readFileSync(path, { encoding: 'utf8' }).split('\n').slice(0, limit).map(parseEvent),
    batchSize,
  )

  for (const batch of lines) {
    await addLines(batch)
  }

  convex.close()
}
await main()

async function addLines(lines: IRCEvent[]) {
  const res = await convex.mutation(api.logs.add, { events: lines })
  console.log('result:', res)
}

function parseEvent(line: string) {
  const [time, ...args] = line.split(' ')
  const timestamp = parseTime(time)

  if (args[0] === '***' || args[0].startsWith('-')) {
    let type = ''

    if (args[3] === 'mode') type = 'mode'
    if (args[3] === 'kicked') type = 'kick'
    if (args[3] === 'joined') type = 'join'
    if (args[3] === 'left') type = 'part'
    if (args[3] === 'quit') type = 'quit'
    if (args[3] === 'topic') type = 'topic'
    if (args[3] === 'nick') type = 'nick'
    if (args[2] === 'invited') type = 'invite'

    return parsed({
      channel,
      timestamp,
      category: 'status',
      type,
      nick: args[1],
      content: args.join(' '),
    })
  }

  if (args[0] === '*') {
    const [_, prefixNick, ...content] = args
    const { nick, prefix } = parseNick(prefixNick)
    return parsed({
      channel,
      timestamp,
      category: 'message',
      type: 'action',
      nick,
      prefix,
      content: content.join(' '),
    })
  }

  if (args[0].startsWith('<')) {
    const [prefixNick, ...content] = args
    const { nick, prefix } = parseNick(prefixNick)
    return parsed({
      channel,
      timestamp,
      category: 'message',
      type: 'message',
      nick,
      prefix,
      content: content.join(' '),
    })
  }

  throw new Error(`failed to parse event: "${line}"`)
}

function parseTime(input: string) {
  const date = new Date(input.slice(1, -1))
  return date.getTime()
}

function parseNick(input: string) {
  const prefixNick = input.replaceAll(/[<>]/g, '')
  const prefix = prefixNick.charAt(0)
  if (['@', '%', '+'].includes(prefix)) {
    return { prefix, nick: prefixNick.slice(1) }
  }
  return { nick: prefixNick }
}

function parsed(args: IRCEvent) {
  return args
}
