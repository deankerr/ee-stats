'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from '@/lib/api'
import { formatName, getNameColorHex } from '@/lib/names'
import React from 'react'
import { PageHeader } from '../page-header'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { BarChart1 } from './bar-chart'
import { BarChartV2 } from './bar-chart-v'
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
          <TabsTrigger value="chart2">Chart 2</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <ActivityTable channel={channel} />
        </TabsContent>
        <TabsContent value="charts1">
          <Charts1 channel={channel} />
        </TabsContent>
        <TabsContent value="chart2">
          <Chart2 channel={channel} />
        </TabsContent>
        <TabsContent value="raw">
          <Raw channel={channel} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

type NickData = { nick: string; total: number }

function ActivityTable({ channel }: { channel: string }) {
  const data = useActivityData(channel)
  const prevNicksRef = React.useRef<NickData[]>([])
  const [flashingRows, setFlashingRows] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (!data?.nicks) return
    if (prevNicksRef.current.length === 0) {
      prevNicksRef.current = data.nicks
      return
    }

    const changedNicks = new Set<string>()
    data.nicks.forEach((nick) => {
      const prevNick = prevNicksRef.current.find((n) => n.nick === nick.nick)
      if (prevNick && prevNick.total !== nick.total) {
        changedNicks.add(nick.nick)
      }
    })

    if (changedNicks.size > 0) {
      setFlashingRows(changedNicks)
      setTimeout(() => setFlashingRows(new Set()), 1000)
    }

    prevNicksRef.current = data.nicks
  }, [data])

  if (!data) return <div>loading...</div>

  const { nicks, total } = data

  return (
    <div className="max-w-sm space-y-2">
      <div className="flex justify-between border p-2 text-13">
        Total <div className="text-right">{total}</div>
      </div>
      <Table className="rounded border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-6 text-center">#</TableHead>
            <TableHead>Nick</TableHead>
            <TableHead className="text-right">Lines</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nicks.slice(0, 30).map((nick, i) => (
            <TableRow key={nick.nick} className={flashingRows.has(nick.nick) ? 'flash' : ''}>
              <TableCell className="text-center"> {i + 1}</TableCell>
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

function Chart2({ channel }: { channel: string }) {
  const data = useActivityData(channel)
  if (!data) return <div>loading...</div>

  const nameActivityData = data.nicks.slice(0, 30).map(({ nick, total }) => ({
    id: nick.replaceAll(/[\[\]{}()]/g, '_'),
    label: formatName(nick),
    activity: total,
    hex: getNameColorHex(nick),
  }))

  const chartData = nameActivityData.map(({ id, activity, hex }) => ({
    user: id,
    activity,
    fill: hex,
  }))

  const chartConfig = {
    activity: {
      label: 'Activity',
    },
    ...Object.fromEntries(
      nameActivityData.map(({ id, label, hex }) => [
        id,
        {
          label,
          color: hex,
        },
      ]),
    ),
  }

  console.log('chartData', chartData)
  console.log('chartConfig', chartConfig)
  return (
    <div>
      <BarChartV2 data={chartData} config={chartConfig} />
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
