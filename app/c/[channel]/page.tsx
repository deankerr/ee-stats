import { SearchInput } from '@/components/channel-page/search-input'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { TUILoading } from '@/components/tui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Metadata } from 'next'
import { StatsActivityAllTime } from './StatsActivityAllTime'

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
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <StatsActivityAllTime channel={channel} />
        </TabsContent>
        <TabsContent value="today" className="">
          <div className="flex h-96">
            <TUILoading />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
