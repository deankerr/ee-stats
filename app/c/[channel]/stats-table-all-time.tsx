'use client'

import { TUILoading } from '@/components/tui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/convex/_generated/api'
import { useQuery } from '@/lib/api'
import { truncate } from '@/lib/names'
import TimeAgo from 'react-timeago'

const useAliasData = (channel: string) => {
  const results = useQuery(api.v1.queries.activity, { channel })
  console.log('alias data', results)
  return results
}

export function StatsTableAllTime({ channel }: { channel: string }) {
  const data = useAliasData(channel)
  if (!data) return <TUILoading />

  const times = {
    first: data.firstTimestamp ?? 0,
    latest: data.latestTimestamp ?? 0,
  }

  const daysLogged = Math.ceil((times.latest - times.first) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Card className="w-48 rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Lines</CardTitle>
          </CardHeader>
          <CardContent>{data.total} </CardContent>
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
            <TimeAgo date={times.latest} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table className="table-fixed">
          <TableHeader className="bg-muted/40 shadow">
            <TableRow>
              <TableHead className="w-12 text-right">#</TableHead>
              <TableHead className="w-48">Nick</TableHead>
              <TableHead className="w-20 text-right">Lines</TableHead>
              <TableHead className="w-20 text-right">%</TableHead>
              <TableHead className="w-36 text-right">Last Seen</TableHead>
              <TableHead className="">Quote</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.aliases.map((user, i) => (
              <TableRow key={user._id}>
                <TableCell className="text-right"> {i + 1}</TableCell>
                <TableCell className="truncate">{user.alias}</TableCell>
                <TableCell className="text-right">{user.count}</TableCell>
                <TableCell className="text-right">{((user.count / data.total) * 100).toFixed(1)}%</TableCell>
                <TableCell className="truncate text-right">
                  {user.latest?.timestamp && (
                    <TimeAgo
                      title={new Date(user.latest.timestamp).toString()}
                      date={user.latest.timestamp}
                      formatter={(value, unit, suffix) => {
                        if (suffix === 'from now') return 'active'
                        if (unit === 'second') return 'active'
                        if (unit === 'minute') return 'active'
                        return [value, `${unit}${value > 1 ? 's' : ''}`, suffix].join(' ')
                      }}
                    />
                  )}
                </TableCell>
                <TableCell className="overflow-hidden truncate">
                  {'content' in user.random ? (
                    <span className="">
                      {user.random.event !== 'message' ? `(${user.random.event}) ` : ''}
                      {truncate(user.random.content, 120)}
                    </span>
                  ) : (
                    '(no data)'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
