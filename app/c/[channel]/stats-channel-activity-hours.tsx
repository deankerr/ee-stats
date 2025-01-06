'use client'

import { TUILoading } from '@/components/tui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { api } from '@/convex/_generated/api'
import { useQuery } from '@/lib/api'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

export function StatsChannelActivityHours({ channel }: { channel: string }) {
  const results = useQuery(api.v1.queries.channelActivity, { channel })
  if (!results)
    return (
      <div className="flex h-96">
        <TUILoading />
      </div>
    )

  const chartData = results
    .map(([hour, count]) => {
      const localHour = (hour - new Date().getTimezoneOffset() / 60 + 24) % 24
      // Use 24-hour format for the label
      const shortLabel = String(localHour).padStart(2, '0')
      // Full format for tooltip (12-hour with AM/PM)
      const fullTime = new Date(2000, 0, 1, localHour).toLocaleString('en-US', {
        hour: 'numeric',
        hour12: true,
      })
      return {
        hour: shortLabel,
        fullTime,
        count,
        rawHour: localHour,
        quarter: Math.floor(localHour / 6) + 1,
        fill: `var(--color-q${Math.floor(localHour / 6) + 1})`,
      }
    })
    .sort((a, b) => a.rawHour - b.rawHour)

  const chartConfig = {
    count: {
      label: 'Count',
      color: 'hsl(var(--chart-1))',
    },
    q1: {
      label: 'Q1',
      color: 'hsl(var(--chart-2))',
    },
    q2: {
      label: 'Q2',
      color: 'hsl(var(--chart-5))',
    },
    q3: {
      label: 'Q3',
      color: 'hsl(var(--chart-4))',
    },
    q4: {
      label: 'Q4',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity by Hour (Local Time)</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hour" tickLine={false} tickMargin={10} axisLine={false} />
            <Bar dataKey="count" fill="var(--color-count)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
