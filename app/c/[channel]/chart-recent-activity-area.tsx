'use client'

import { TUILoading } from '@/components/tui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRecentActivityQuery } from '@/lib/api'
import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  count: {
    label: 'Activity',
  },
  activity: {
    label: 'Hour',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function ChartRecentActivityArea({
  channel,
  ...props
}: { channel: string } & React.ComponentPropsWithRef<typeof Card>) {
  const [timeRange, setTimeRange] = React.useState('1d')

  const data = useRecentActivityQuery(channel)
  if (!data) return <TUILoading />

  const hours = timeRange === '1d' ? 24 : 72
  const filteredData = data.activityPerHour.slice(72 - hours)
  const totalLines = filteredData.reduce((acc, item) => acc + item.count, 0)

  return (
    <Card {...props}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Activity</CardTitle>
          <CardDescription>{`${totalLines} lines in the last ${hours} hours`}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1d" className="rounded-lg">
              Last 24 Hours
            </SelectItem>
            <SelectItem value="3d" className="rounded-lg">
              Last 72 Hours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-activity)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-activity)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timeFrom"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  hour12: false,
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    date.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      hour12: false,
                    })
                    return value
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="count"
              type="natural"
              fill="url(#fillActivity)"
              stroke="var(--color-activity)"
              stackId="a"
            />
            {/* <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            /> */}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
