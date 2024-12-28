import { ChannelPage } from '@/components/channel-page/channel-page'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ channel: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const channel = (await params).channel
  return {
    title: `#${channel}`,
  }
}

export default async function Page({ params }: { params: Promise<{ channel: string }> }) {
  const channel = (await params).channel

  return <ChannelPage channel={channel} />
}
