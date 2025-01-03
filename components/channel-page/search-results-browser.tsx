import { api } from '@/convex/_generated/api'
import { useStableQuery } from '@/hooks/use-stable-query'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { CLILoadingSpinner } from './cli-spinner'
import { LogEntryLine } from './log-entry-line'

export function SearchResultsBrowser({ channel }: { channel: string }) {
  const [searchQueryValue] = useQueryState('search')
  const value = searchQueryValue?.trim() ? searchQueryValue.trim() : null

  const results = useStableQuery(api.queries.search, value ? { channel, value } : 'skip')

  if (!value) return null
  return (
    <div
      className={cn(
        'relative divide-y overflow-y-auto overflow-x-hidden bg-background px-[1ch] pb-2 text-15',
      )}
      style={{
        scrollbarGutter: 'stable',
      }}
    >
      {!results && (
        <div className="stack h-full place-content-center">
          <CLILoadingSpinner className="-translate-y-1/2" border="double" />
        </div>
      )}

      {results?.map((item, i) => (
        <LogEntryLine
          id={`ee-log-entry-${results.length - i}`}
          key={item.id}
          type={item.type}
          name={item.nick}
          content={item.content}
          timestamp={item.timestamp}
          showDate
          className="flex py-2 hover:bg-muted/50"
        >
          <Link className="link text-right text-sm" href={`/channel/${channel}/time/${item.timestamp}`}>
            jump to
          </Link>
        </LogEntryLine>
      ))}

      {results?.length === 0 && (
        <div className="stack h-full place-content-center">
          <CLILoadingSpinner className="-translate-y-1/2" border="double" spinner="none">
            NO RESULTS
          </CLILoadingSpinner>
        </div>
      )}
    </div>
  )
}
