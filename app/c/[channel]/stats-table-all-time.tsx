'use client'

import { TUILoading } from '@/components/tui'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAliasDataQuery } from '@/lib/api'
import { truncate } from '@/lib/names'
import Link from 'next/link'
import TimeAgo from 'react-timeago'

export function StatsTableAllTime({ channel }: { channel: string }) {
  const data = useAliasDataQuery(channel)
  if (!data) return <TUILoading />

  return (
    <div className="space-y-4">
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
                <TableCell className="">
                  <Link
                    href={`/c/${channel}/user/${encodeURIComponent(user.alias)}`}
                    className="link decoration-dashed"
                  >
                    {user.alias}
                  </Link>
                </TableCell>
                <TableCell className="text-right">{user.count}</TableCell>
                <TableCell className="text-right">{((user.count / data.total) * 100).toFixed(1)}%</TableCell>
                <TableCell className="truncate text-right">
                  {user.latest?.timestamp && (
                    <TimeAgo
                      title={new Date(user.latest.timestamp).toString()}
                      date={user.latest.timestamp}
                      formatter={(value, unit, suffix) => {
                        if (suffix === 'from now') return 'today'
                        if (unit === 'second') return 'today'
                        if (unit === 'minute') return 'today'
                        if (unit === 'hour') return 'today'
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
