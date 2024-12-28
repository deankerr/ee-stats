import { ChannelPage } from '@/components/channel-page'

export default async function Page({ params }: { params: Promise<{ channel: string }> }) {
  const channel = (await params).channel

  return <ChannelPage channel={channel} />
}
