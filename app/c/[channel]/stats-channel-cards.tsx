'use client'

import { TUILoading } from '@/components/tui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useChannelQuery } from '@/lib/api'
import TimeAgo from 'react-timeago'

function getDaysBetween(time1: number, time2: number) {
  return Math.ceil((time1 - time2) / (1000 * 60 * 60 * 24))
}

export function StatsChannelCards({ channel }: { channel: string }) {
  const data = useChannelQuery(channel)

  if (!data) {
    return (
      <div className="flex gap-2">
        <TUILoading />
      </div>
    )
  }

  const firstAt = data.firstAt ?? 0
  const latestAt = data.latestAt ?? 0
  const daysLogged = getDaysBetween(latestAt, firstAt)

  return (
    <div className="flex gap-4">
      <Card className="w-48 rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Lines</CardTitle>
        </CardHeader>
        <CardContent>{data.count}</CardContent>
      </Card>

      <Card className="w-48 rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Days Logged</CardTitle>
        </CardHeader>
        <CardContent>{daysLogged}</CardContent>
      </Card>

      <Card className="w-48 rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeAgo date={latestAt} />
        </CardContent>
      </Card>
    </div>
  )
}
