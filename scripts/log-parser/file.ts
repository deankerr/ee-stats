import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, format } from 'node:path'
import { drop } from 'remeda'

const OUTPUT_DIR = '.logs'
const OUTPUT_VALUES = true
const OUTPUT_ENTRIES = false

type LogLine = {
  timestamp: number
  type: string
  prefix: string
  nick: string
  content: string
}

export async function parseToLogLines(path: string) {
  const t = Date.now()
  const logItems = await readLogFile(path)

  if (OUTPUT_ENTRIES) await writeFile(await getOutputPath(path, '.entries.jsonl'), serializeToJSONL(logItems))
  if (OUTPUT_VALUES)
    await writeFile(await getOutputPath(path, '.values.jsonl'), serializeToJSONLValues(logItems))

  console.log('parse', logItems.length, Date.now() - t, 'ms')
  return logItems
}

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
    if (['quit', 'part'].includes(type)) content = content.slice(1, -1)
    if (type === 'nick') content = content.slice(3)
    if (type === 'topic') content = content.slice(4, -1)

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

function serializeToJSONL(logLines: LogLine[]) {
  return logLines.map((item) => JSON.stringify(item)).join('\n')
}

function serializeToJSONLValues(logLines: LogLine[]) {
  return logLines.map((l) => JSON.stringify([l.timestamp, l.type, l.prefix, l.nick, l.content])).join('\n')
}

async function getOutputPath(inputPath: string, ext: string) {
  await mkdir(OUTPUT_DIR, { recursive: true })
  return format({ dir: OUTPUT_DIR, name: basename(inputPath), ext })
}
