import { ChartRecentActivityArea } from './chart-recent-activity-area'
import { StatsChannelCards } from './stats-channel-cards'

export function ChannelOverview({ channel }: { channel: string }) {
  return (
    <div className="space-y-4">
      <StatsChannelCards channel={channel} />

      <div className="grid grid-cols-6 gap-4">
        <ChartRecentActivityArea channel={channel} className="col-span-full" />
      </div>
    </div>
  )
}
