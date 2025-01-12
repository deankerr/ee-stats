import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Metadata } from 'next'
import Link from 'next/link'
import UserWordCloud from '../../word-cloud'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ channel: string; user: string }>
}): Promise<Metadata> {
  const channel = (await params).channel
  const user = (await params).user
  return {
    title: `#${channel} / ${user}`,
  }
}

export default async function Page({ params }: { params: Promise<{ channel: string; user: string }> }) {
  const channel = (await params).channel
  const user = decodeURIComponent((await params).user)

  return (
    <Tabs defaultValue="word-cloud" className="flex-1 space-y-4 p-2 pt-2 sm:p-8 sm:pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          <Link href={`/c/${channel}`} className="link decoration-dotted">
            #{channel}
          </Link>{' '}
          / {user}
        </h2>
      </div>

      <TabsList className="self-start">
        <TabsTrigger value="word-cloud">Word Cloud</TabsTrigger>
      </TabsList>

      <TabsContent value="word-cloud">
        <UserWordCloud channel={channel} user={user} />
      </TabsContent>
    </Tabs>
  )
}
