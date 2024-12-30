import { api } from '@/convex/_generated/api'
import { useStableQuery } from '@/hooks/use-stable-query'
import { cn } from '@/lib/utils'
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
        'relative divide-y overflow-y-auto overflow-x-hidden bg-background px-[1ch] pb-2 text-sm',
      )}
      style={{
        scrollbarGutter: 'stable',
      }}
    >
      {results?.map((item, i) => (
        <LogEntryLine
          id={`ee-log-entry-${results.length - i}`}
          key={item._id}
          type={item.type}
          name={item.nick}
          content={item.content}
          timestamp={item.timestamp}
          className="flex py-1.5"
        />
      ))}

      {results?.length === 0 && (
        <div className="relative top-1/3 text-center text-muted-foreground">No results.</div>
      )}

      {!results && <CLILoadingSpinner className="top-1/3" border="double" enabled={true} />}
    </div>
  )
}
