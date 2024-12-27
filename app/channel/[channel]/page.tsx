import { LogViewPage } from '@/components/log-view'

export default async function Page({ params }: { params: Promise<{ channel: string }> }) {
  const channel = (await params).channel

  return <LogViewPage channel={channel} />
}
