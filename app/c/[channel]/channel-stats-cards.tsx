'use client'

import { TUILoading } from '@/components/tui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useChannelQuery } from '@/lib/api'
import TimeAgo from 'react-timeago'

function getDaysBetween(time1: number, time2: number) {
  return Math.ceil((time1 - time2) / (1000 * 60 * 60 * 24))
}

export function ChannelStatsCards({ channel }: { channel: string }) {
  const data = useChannelQuery(channel)

  const totalLines = data?.count ?? 0
  const firstAt = data?.firstAt ?? 0
  const latestAt = data?.latestAt ?? 0
  const daysLogged = getDaysBetween(latestAt, firstAt)

  return (
    <div className="flex flex-wrap gap-4">
      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Lines</CardTitle>
        </CardHeader>
        <CardContent>{totalLines}</CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Days Logged</CardTitle>
        </CardHeader>
        <CardContent>{daysLogged}</CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeAgo
            date={latestAt}
            formatter={(value, unit, suffix) => {
              if (suffix === 'from now') return 'just now'
              return `${value} ${unit}${value > 1 ? 's' : ''} ${suffix}`
            }}
          />
        </CardContent>
      </Card>

      {!data && (
        <div className="absolute inset-x-0 flex h-96">
          <TUILoading />
        </div>
      )}
    </div>
  )
}
