import type { LogEntry } from '@/convex/logs'
import type { WithoutSystemFields } from 'convex/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { format } from 'node:path'
import { drop } from 'remeda'

const OUTPUT_DIR = '.logs'
const OUTPUT_VALUES = false
const OUTPUT_ENTRIES = true

type LogEntryFields = WithoutSystemFields<LogEntry>

async function main() {
  const inputPath = process.argv[2]
  const channel = process.argv[3]
  await parseFileToLogEntries(inputPath, channel)
}
await main()

function getCategory(type: string): LogEntry['category'] {
  return ['message', 'action'].includes(type) ? ('message' as const) : ('status' as const)
}

export async function parseFileToLogEntries(inputPath: string, channel: string) {
  const t = Date.now()
  const logEntryFields = (await readFile(inputPath, { encoding: 'utf8' }))
    .split('\n')
    .filter((l) => l)
    .map((line) => parseLogLine(line, channel))

  if (OUTPUT_ENTRIES)
    await writeFile(await getOutputPath(`${channel}.entries.jsonl`), serializeToJSONL(logEntryFields))
  if (OUTPUT_VALUES)
    await writeFile(await getOutputPath(`${channel}.values.jsonl`), serializeToJSONLValues(logEntryFields))

  console.log('parse', logEntryFields.length, 'lines,', Date.now() - t, 'ms')
  return logEntryFields
}

function parseLogLine(line: string, channel: string): LogEntryFields {
  const args = line.split(' ')
  const timestamp = parseTime(args[0])

  // status/mode
  if (args[1] === '***') {
    const [nick, _, typed, ...contentArgs] = drop(args, 2)
    const type = typed.replace(/ed$/, '').replace('left', 'part')

    let content = contentArgs.join(' ')
    if (['quit', 'part'].includes(type)) content = content.slice(1, -1)
    if (type === 'nick') content = content.slice(3)
    if (type === 'topic') content = content.slice(4, -1)

    return {
      channel,
      timestamp,
      category: getCategory(type),
      type,
      content,
      ...parseNick(nick),
    }
  }

  // invite
  if (args[1].startsWith('-') && args[3] === 'invited') {
    const type = 'invite'
    return {
      channel,
      timestamp,
      category: getCategory(type),
      type,
      content: args[4],
      ...parseNick(args[2]),
    }
  }

  // action
  if (args[1] === '*') {
    const [prefixNick, ...content] = drop(args, 2)
    return {
      channel,
      timestamp,
      category: getCategory('action'),
      type: 'action',
      content: content.join(' '),
      ...parseNick(prefixNick),
    }
  }

  // privmsg
  if (args[1].startsWith('<')) {
    const [prefixNick, ...content] = drop(args, 1)
    return {
      channel,
      timestamp,
      category: getCategory('message'),
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

function serializeToJSONL(logLines: LogEntryFields[]) {
  return logLines.map((item) => JSON.stringify(item)).join('\n')
}

function serializeToJSONLValues(logLines: LogEntryFields[]) {
  return logLines.map((l) => JSON.stringify([l.timestamp, l.type, l.prefix, l.nick, l.content])).join('\n')
}

async function getOutputPath(outputFilename: string) {
  await mkdir(OUTPUT_DIR, { recursive: true })
  return format({ dir: OUTPUT_DIR, base: outputFilename })
}
