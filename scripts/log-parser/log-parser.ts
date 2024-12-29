import { api } from '@/convex/_generated/api'
import { ConvexClient } from 'convex/browser'
import { chunk } from 'remeda'
import { parseToLogLines } from './file'

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
const batchSize = 8192

const inputPath = process.argv[2]
const channel = process.argv[3]

async function main() {
  console.log(inputPath, `#${channel}`)
  const latest = await convex.query(api.logs.getLatest, { channel })
  console.log('latest:', latest)

  const logLines = (await parseToLogLines(inputPath))
    .filter((line) => line.timestamp > (latest?.timestamp ?? 0))
    .map((line) => ({
      ...line,
      category: ['message', 'action'].includes(line.type) ? ('message' as const) : ('status' as const),
    }))

  const logBatches = chunk(logLines, batchSize)

  for (const logs of logBatches) {
    await convex.mutation(api.logs.add, { channel, logs })
    console.log('added', logs.length, 'logs')
    break // temp
  }
}

await main()
convex.close()
