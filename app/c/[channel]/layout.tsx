import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ channel: string }>
}): Promise<Metadata> {
  const channel = (await params).channel
  return {
    title: `#${channel}`,
  }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
