'use client'

import { geistMono } from '@/app/fonts/fonts'
import { scaleLog } from '@visx/scale'
import { Text } from '@visx/text'
import Wordcloud from '@visx/wordcloud/lib/Wordcloud'
import { useCallback, useMemo } from 'react'

type WordData = {
  text: string
  value: number
}

const defaultHeight = 640
const defaultWidth = 985

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
    range: [14, 48],
  })
}

const fixedValueGenerator = () => 0.5

export function WordCloud({
  width = defaultWidth,
  height = defaultHeight,
  words,
  limit,
}: {
  width?: number
  height?: number
  words: WordData[]
  limit?: number
}) {
  const wordData = limit ? words.slice(0, limit) : words

  const fontScale = useMemo(() => getFontScale(wordData), [wordData])
  const fontSizeSetter = useCallback((datum: WordData) => fontScale(datum.value), [fontScale])

  return (
    <div className="w-fit select-none rounded-md border border-muted">
      <Wordcloud
        words={wordData}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={geistMono.style.fontFamily}
        fontWeight={500}
        padding={4}
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
