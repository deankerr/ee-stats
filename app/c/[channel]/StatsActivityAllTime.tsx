'use client'

import { TUILoading } from '@/components/tui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/convex/_generated/api'
import { useQuery } from '@/lib/api'
import React from 'react'
import TimeAgo from 'react-timeago'

const useActivityData = (channel: string) => {
  const data = useQuery(api.queries.activity, { channel })
  console.log('activity data', data)
  return data
}

export function StatsActivityAllTime({ channel }: { channel: string }) {
  const data = useActivityData(channel)
  if (!data)
    return (
      <div className="flex h-96">
        <TUILoading />
      </div>
    )

  return (
    <div className="space-y-6 py-3">
      <div className="flex">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent>{data.total} messages</CardContent>
        </Card>
      </div>

      <Table className="table-fixed rounded border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-center">#</TableHead>
            <TableHead className="w-40">Nick</TableHead>
            <TableHead className="w-24 text-right">Lines</TableHead>
            <TableHead className="w-20 text-right">%</TableHead>
            <TableHead className="w-40 text-right">Last Seen</TableHead>
            <TableHead className="">Quote</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.users.map((user, i) => (
            <TableRow key={user.nick}>
              <TableCell className="text-right"> {i + 1}</TableCell>
              <TableCell className="truncate">{user.nick}</TableCell>
              <TableCell className="text-right">{user.total}</TableCell>
              <TableCell className="text-right">{((user.total / data.total) * 100).toFixed(1)}%</TableCell>
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
              <TableCell className="truncate">{user.latest?.content.slice(0, 100)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
