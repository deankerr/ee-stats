'use client'

import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'

export function BarChartVertical({
  data,
  config,
}: {
  data: { user: string; amount: number; fill: string }[]
  config: ChartConfig
}) {
  return (
    <ChartContainer config={config} className="min-h-[800px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
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
          tickFormatter={(value) => (config[value]?.label as string) ?? ''}
        />
        <XAxis dataKey="amount" type="number" hide />
        <Bar dataKey="amount" layout="vertical" radius={5}>
          <LabelList dataKey="amount" position="right" offset={8} className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
