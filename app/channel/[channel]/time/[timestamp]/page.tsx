import { TimestampBrowser } from '@/components/channel-page/timestamp-browser'

export default async function Page({ params }: { params: Promise<{ channel: string; timestamp: string }> }) {
  const { channel, timestamp } = await params

  return <TimestampBrowser channel={channel} timestamp={Number(timestamp)} />
}
