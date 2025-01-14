'use client'

import { TUILoading } from '@/components/tui'
import { useArtifactQuery } from '@/lib/api'
import { WordCloud } from './word-cloud'

export function ArtifactWordCloud({ channel, alias }: { channel: string; alias: string }) {
  const artifactData = useArtifactQuery(channel, alias)

  if (!artifactData) {
    return artifactData === null ? (
      <div>User not found.</div>
    ) : (
      <div className="flex h-96">
        <TUILoading />
      </div>
    )
  }

  if (!artifactData.wordCloud) {
    return <div>No artifacts found.</div>
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <WordCloud words={artifactData.wordCloud.content} limit={180} />
      </div>
    </div>
  )
}
