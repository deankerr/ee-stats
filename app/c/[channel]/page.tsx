import { ThemeSwitcher } from '@/components/theme-switcher'
import { TUILoading } from '@/components/tui'
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
    <div className="flex min-h-dvh flex-col gap-2 p-4 pt-2">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">#{channel}</h2>
        <div className="flex gap-2">
          <ThemeSwitcher variant="outline" />
        </div>
      </header>

      <Tabs defaultValue="stats" className="contents data-[state=active]:[&>div]:flex-1">
        <TabsList className="self-start">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          {/* <TabsTrigger value="dev">Dev</TabsTrigger> */}
        </TabsList>
        <TabsContent value="stats">
          <StatsTableAllTime channel={channel} />
        </TabsContent>
        <TabsContent value="hours" className="">
          <StatsChannelActivityHours channel={channel} />
        </TabsContent>
        <TabsContent value="users" className="">
          <StatsBarChartAllTime channel={channel} />
        </TabsContent>
        <TabsContent value="dev" className="">
          <TUILoading />
        </TabsContent>
      </Tabs>
    </div>
  )
}
