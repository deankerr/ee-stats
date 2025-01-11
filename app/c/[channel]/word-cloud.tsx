'use client'

import { geistMono } from '@/app/fonts/fonts'
import { useUserQuery } from '@/lib/api'
import { scaleLog } from '@visx/scale'
import { Text } from '@visx/text'
import Wordcloud from '@visx/wordcloud/lib/Wordcloud'
import { useCallback, useMemo } from 'react'

export default function UserWordCloud({ channel, user }: { channel: string; user: string }) {
  const userData = useUserQuery(channel, user)

  if (!userData) {
    return userData === null ? <div>User not found.</div> : <div>Loading...</div>
  }

  if (userData.artifacts.length === 0) {
    return <div>Nothing found for this user.</div>
  }

  const words: WordData[] = userData.artifacts[0].content

  return (
    <div>
      <WordCloud width={1200} height={700} showControls words={words} />
    </div>
  )
}

interface Props {
  width: number
  height: number
  showControls?: boolean
  words: WordData[]
}

export interface WordData {
  text: string
  value: number
}

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3)',
  // 'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

function getFontScale(words: WordData[]) {
  return scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [20, 85],
  })
}

const fixedValueGenerator = () => 0.5

export function WordCloud({ width, height, words }: Props) {
  const fontScale = useMemo(() => getFontScale(words), [words])
  const fontSizeSetter = useCallback((datum: WordData) => fontScale(datum.value), [fontScale])

  return (
    <div className="m-4 flex w-fit select-none rounded-md border border-muted">
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={geistMono.style.fontFamily}
        fontWeight={500}
        padding={5}
        spiral={'archimedean'}
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontWeight={w.weight}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </div>
  )
}
