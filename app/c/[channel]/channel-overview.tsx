import { Card } from '@/components/ui/card'
import { ChartRecentActivityArea } from './chart-recent-activity-area'
import { StatsChannelCards } from './stats-channel-cards'
import { StatsUserTable } from './stats-user-table'

export function ChannelOverview({ channel }: { channel: string }) {
  return (
    <div className="space-y-4">
      <StatsChannelCards channel={channel} />

      <div className="grid grid-cols-5 gap-4">
        <ChartRecentActivityArea channel={channel} />
        <Card className="col-span-2">
          <StatsUserTable channel={channel} />
        </Card>
      </div>
    </div>
  )
}
