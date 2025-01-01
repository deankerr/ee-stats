import { StatsPage } from '@/components/stats-page/stats-page'

export default async function Page({ params }: { params: Promise<{ channel: string }> }) {
  const channel = (await params).channel

  return <StatsPage channel={channel} />
}
