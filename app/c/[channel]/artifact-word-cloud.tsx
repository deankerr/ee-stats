'use client'

import { TUILoading } from '@/components/tui'
import { useIsMobile } from '@/hooks/use-mobile'
import { useArtifactQuery } from '@/lib/api'
import { ScaleSVG } from '@visx/responsive'
import { WordCloud } from './word-cloud'

const WIDTH = 1000
const HEIGHT = 650

const LIMIT = 180

export function ArtifactWordCloud({ channel, alias }: { channel: string; alias: string }) {
  const isMobile = useIsMobile()
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
    <div className="select-none overflow-x-auto">
      <Scaler enabled={!isMobile}>
        <WordCloud width={WIDTH} height={HEIGHT} words={artifactData.wordCloud.content} limit={LIMIT} />
      </Scaler>
    </div>
  )
}

function Scaler({ enabled = true, children }: { enabled?: boolean; children: React.ReactNode }) {
  return enabled ? (
    <ScaleSVG width={WIDTH} height={HEIGHT}>
      {children}
    </ScaleSVG>
  ) : (
    children
  )
}
