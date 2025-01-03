import { PageBrowser } from '@/components/channel-page/page-browser'

export default async function Page({ params }: { params: Promise<{ channel: string; page: string }> }) {
  const { channel, page } = await params

  return <PageBrowser channel={channel} page={Number(page)} />
}
