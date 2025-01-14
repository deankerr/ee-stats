'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSessionStorage } from '@reactuses/core'
import { ArtifactWordCloud } from './artifact-word-cloud'
import { ChannelOverview } from './channel-overview'
import { StatsBarChartAllTime } from './stats-bar-chart-all-time'
import { StatsTableAllTime } from './stats-table-all-time'

export function ChannelPage({ channel }: { channel: string }) {
  const [tab, setTab] = useSessionStorage('tab', 'overview')
  return (
    <Tabs
      value={tab || 'overview'}
      onValueChange={setTab}
      className="flex-1 space-y-4 p-2 pt-2 sm:p-8 sm:pt-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">#{channel}</h2>
      </div>

      <TabsList className="self-start">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="chart">Lines</TabsTrigger>
        <TabsTrigger value="word_cloud">Words</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ChannelOverview channel={channel} />
      </TabsContent>
      <TabsContent value="users">
        <StatsTableAllTime channel={channel} />
      </TabsContent>
      <TabsContent value="chart">
        <StatsBarChartAllTime channel={channel} />
      </TabsContent>
      <TabsContent value="word_cloud">
        <ArtifactWordCloud channel={channel} alias="*" />
      </TabsContent>
    </Tabs>
  )
}
