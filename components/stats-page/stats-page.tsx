'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { PageHeader } from '../page-header'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { BarChart1 } from './bar-chart'
import { PieChart1 } from './pie-chart'

const useActivityData = (channel: string) => {
  const data = useQuery(api.queries.activity, { channel })
  return data
}

export function StatsPage({ channel }: { channel: string }) {
  return (
    <div className="flex flex-col">
      <PageHeader channel={channel} page="stats" />
      <Tabs defaultValue="activity" className="p-2">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="charts1">Charts 1</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <ActivityTable channel={channel} />
        </TabsContent>
        <TabsContent value="charts1">
          <Charts1 channel={channel} />
        </TabsContent>
        <TabsContent value="raw">
          <Raw channel={channel} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ActivityTable({ channel }: { channel: string }) {
  const data = useActivityData(channel)
  if (!data) return <div>loading...</div>

  const { nicks, total } = data

  return (
    <div>
      <Table className="mx-auto max-w-sm rounded border">
        <TableHeader>
          <TableRow>
            <TableHead>Nick</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-semibold">
            <TableCell>Total</TableCell>
            <TableCell className="text-right">{total}</TableCell>
          </TableRow>
          {nicks.map((nick) => (
            <TableRow key={nick.nick}>
              <TableCell>{nick.nick}</TableCell>
              <TableCell className="text-right">{nick.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function Charts1({ channel }: { channel: string }) {
  const data = useActivityData(channel)
  if (!data) return <div>loading...</div>

  const pieChartData = data.nicks
    .slice(0, 6)
    .map(({ nick, total }) => ({ nick, activity: total, fill: `var(--color-${nick})` }))

  const pieChartConfig = {
    activity: {
      label: 'Activity',
    },
    ...Object.fromEntries(
      pieChartData.map(({ nick }, i) => [
        nick,
        {
          label: nick,
          color: `hsl(var(--chart-${i + 1}))`,
        },
      ]),
    ),
  }

  const barChartData = data.nicks.slice(0, 10).map(({ nick, total }) => ({ nick, activity: total }))

  return (
    <div className="flex flex-wrap gap-4">
      <BarChart1 data={barChartData} />
      <PieChart1 data={pieChartData} config={pieChartConfig} />
    </div>
  )
}

function Raw({ channel }: { channel: string }) {
  const data = useActivityData(channel)
  if (!data) return <div>loading...</div>

  const { total, nicks } = data
  return (
    <div>
      total: {total}
      <pre className="text-xs">{JSON.stringify(nicks, null, 2)}</pre>
    </div>
  )
}
