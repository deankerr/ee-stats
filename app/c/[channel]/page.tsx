import { SearchInput } from '@/components/search-input'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Metadata } from 'next'
import { StatsBarChartAllTime } from './stats-bar-chart-all-time'
import { StatsChannelActivityHours } from './stats-channel-activity-hours'
import { StatsTableAllTime } from './stats-table-all-time'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ channel: string }>
}): Promise<Metadata> {
  const channel = (await params).channel
  return {
    title: `#${channel}`,
  }
}

export default async function Page({ params }: { params: Promise<{ channel: string }> }) {
  const channel = (await params).channel

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">#{channel}</h2>
        <div className="flex gap-2">
          <SearchInput />
          <ThemeSwitcher />
        </div>
      </div>

      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <StatsTableAllTime channel={channel} />
        </TabsContent>
        <TabsContent value="chart" className="py-2">
          <StatsBarChartAllTime channel={channel} />
        </TabsContent>
        <TabsContent value="hours" className="py-2">
          <StatsChannelActivityHours channel={channel} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
