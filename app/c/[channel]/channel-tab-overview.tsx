import { ChannelStatsCards } from './channel-stats-cards'
import { ChartChannelRecentActivity } from './chart-channel-recent-activity'

export function ChannelTabOverview({ channel }: { channel: string }) {
  return (
    <div className="space-y-4">
      <ChannelStatsCards channel={channel} />

      <div className="grid grid-cols-6 gap-4">
        <ChartChannelRecentActivity channel={channel} className="col-span-full" />
      </div>
    </div>
  )
}
