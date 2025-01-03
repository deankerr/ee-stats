'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useQuery } from 'convex-helpers/react/cache'
import { PageHeader } from '../page-header'
import { LogEntryLine } from './log-entry-line'

export function TimestampBrowser({ channel, timestamp }: { channel: string; timestamp: number }) {
  const logEntries = useQuery(api.queries.getPageFor, { channel, timestamp })

  return (
    <>
      <PageHeader channel={channel} page="feed" />
      <div className="flex flex-col overflow-hidden">
        {/* scroll container */}
        <div
          className={cn('flex-1 snap-y snap-mandatory overflow-y-auto overflow-x-hidden px-[1ch]')}
          style={{
            scrollbarGutter: 'stable',
            overflowAnchor: 'none',
          }}
        >
          {logEntries?.map((item, i) => {
            return (
              <LogEntryLine
                id={`ee-log-entry-${logEntries.length - i}`}
                key={item.id}
                type={item.type}
                name={item.nick}
                content={item.content}
                timestamp={item.timestamp}
                className={cn(
                  'flex snap-start py-0.5 hover:bg-muted/50',
                  item.timestamp === timestamp && 'bg-muted text-muted-foreground',
                )}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
