'use client'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'

export function BarChartV2({
  data,
  config,
}: {
  data: { user: string; activity: number; fill: string }[]
  config: ChartConfig
}) {
  return (
    <ChartContainer config={config} className="min-h-[800px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 80,
        }}
      >
        <YAxis
          dataKey="user"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => (config[value]?.label as string) ?? ''}
        />
        <XAxis dataKey="activity" type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="font-sans" />} />
        <Bar dataKey="activity" layout="vertical" radius={5}>
          <LabelList
            dataKey="activity"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
