'use client'

import { TUILoading } from '@/components/tui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { useAliasDataQuery } from '@/lib/api'
import { formatName, getNameColorHex } from '@/lib/names'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'

export function ChartAliasLinesTotal({ channel }: { channel: string }) {
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

  const chartConfig: ChartConfig = {
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
        <ChartContainer config={chartConfig} className="aspect-auto h-[800px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 100,
            }}
          >
            <YAxis
              dataKey="user"
              type="category"
              tickLine={false}
              tickMargin={6}
              axisLine={false}
              tickFormatter={(value) => (chartConfig[value]?.label as string) ?? ''}
            />
            <XAxis dataKey="amount" type="number" hide />
            <Bar dataKey="amount" layout="vertical" radius={5}>
              <LabelList
                dataKey="amount"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
