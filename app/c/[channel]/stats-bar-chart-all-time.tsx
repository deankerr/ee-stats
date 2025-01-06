'use client'

import { TUILoading } from '@/components/tui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAliasDataQuery } from '@/lib/api'
import { formatName, getNameColorHex } from '@/lib/names'
import { BarChartVertical } from './bar-chart-v'

export function StatsBarChartAllTime({ channel }: { channel: string }) {
  const data = useAliasDataQuery(channel)
  if (!data)
    return (
      <div className="flex h-96">
        <TUILoading />
      </div>
    )

  const nameActivityData = data.aliases.slice(0, 30).map(({ alias, count }) => ({
    id: alias.replaceAll(/[\[\]{}()]/g, '_'),
    label: formatName(alias),
    amount: count,
    hex: getNameColorHex(alias),
  }))

  const chartData = nameActivityData.map(({ id, amount, hex }) => ({
    user: id,
    amount,
    fill: hex,
  }))

  const chartConfig = {
    amount: {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity - All Time</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <BarChartVertical data={chartData} config={chartConfig} />
      </CardContent>
    </Card>
  )
}
