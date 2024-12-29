import { ConvexClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { readFile, writeFile } from 'node:fs/promises'
import { drop } from 'remeda'

type LogLine = {
  timestamp: number
  type: string
  prefix: string
  nick: string
  content: string
}

async function main() {
  const inputPath = process.argv[2]
  const logItems = await readLogFile(inputPath)

  await writeFile(`${inputPath}.jsonl`, logItems.map((item) => JSON.stringify(item)).join('\n'))
  await writeFile(`${inputPath}.values.jsonl`, logItems.map(serializeToValues).join('\n'))
}
await main()

async function readLogFile(path: string) {
  const file = await readFile(path, { encoding: 'utf8' })
  return file
    .split('\n')
    .filter((l) => l)
    .map(parseLogLine)
}

function parseLogLine(line: string): LogLine {
  const args = line.split(' ')
  const timestamp = parseTime(args[0])

  // status/mode
  if (args[1] === '***') {
    const [nick, _, typed, ...contentArgs] = drop(args, 2)
    const type = typed.replace(/ed$/, '').replace('left', 'part')

    let content = contentArgs.join(' ')

    if (['quit', 'part'].includes(type)) {
      content = content.slice(1, -1)
    }

    if (type === 'nick') {
      content = content.slice(3)
    }

    if (type === 'topic') {
      content = content.slice(4, -1)
    }

    return {
      timestamp,
      type,
      content,
      ...parseNick(nick),
    }
  }

  // invite
  if (args[1].startsWith('-') && args[3] === 'invited') {
    return {
      timestamp,
      type: 'invite',
      content: args[4],
      ...parseNick(args[2]),
    }
  }

  // action
  if (args[1] === '*') {
    const [prefixNick, ...content] = drop(args, 2)
    return {
      timestamp,
      type: 'action',
      content: content.join(' '),
      ...parseNick(prefixNick),
    }
  }

  // privmsg
  if (args[1].startsWith('<')) {
    const [prefixNick, ...content] = drop(args, 1)
    return {
      timestamp,
      type: 'message',
      content: content.join(' '),
      ...parseNick(prefixNick),
    }
  }

  throw new Error(`failed to parse event: "${line}"`)
}

function parseNick(input: string) {
  const prefixNick = input.replaceAll(/[<>]/g, '')
  if (['@', '%', '+'].includes(prefixNick.charAt(0))) {
    return { prefix: prefixNick.charAt(0), nick: prefixNick.slice(1) }
  }
  return { prefix: '', nick: prefixNick }
}

function parseTime(input: string) {
  const date = new Date(input.slice(1, -1))
  return date.getTime()
}

function serializeToValues(logLine: LogLine) {
  return JSON.stringify([logLine.timestamp, logLine.type, logLine.prefix, logLine.nick, logLine.content])
}
