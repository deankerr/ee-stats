'use client'

import { api } from '@/convex/_generated/api'
import { EVENT_NAMES } from '@/convex/constants'
import { useQuery } from 'convex/react'
import Link from 'next/link'
import { ThemeSwitcher } from '../theme-switcher'
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
      <Header channel={channel} />
      <Tabs defaultValue="activity" className="p-4">
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

function Header({ channel }: { channel: string }) {
  return (
    <header className="sticky top-0 z-10 grid flex-none grid-cols-3 items-center border-b bg-background px-2 py-1 text-15 font-[450] shadow">
      <div className="flex items-center gap-2 px-2">
        <h1>ee #{channel} stats</h1>
      </div>

      <div className="">{/* <SearchInput className="w-full" /> */}</div>

      <div className="flex items-center justify-end gap-1">
        <Link href={`/channel/${channel}`} className="px-1 underline underline-offset-2">
          feed
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  )
}

function ActivityTable({ channel }: { channel: string }) {
  const data = useActivityData(channel)
  if (!data) return <div>loading...</div>

  const { nicks } = data

  return (
    <div>
      <Table className="mx-auto max-w-4xl rounded border">
        <TableHeader>
          <TableRow>
            <TableHead>Nick</TableHead>
            <TableHead>Total</TableHead>
            {EVENT_NAMES.map((event) => (
              <TableHead key={event}>{event}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {nicks.map((nick) => (
            <TableRow key={nick.nick}>
              <TableCell>{nick.nick}</TableCell>
              <TableCell>{nick.total}</TableCell>
              {EVENT_NAMES.map((event) => (
                <TableCell key={event}>{nick.events.find((ev) => ev.event === event)?.count}</TableCell>
              ))}
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
