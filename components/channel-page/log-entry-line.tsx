import { cn } from '@/lib/utils'
import { memo } from 'react'

export const LogEntryLine = memo(
  ({
    type,
    name,
    content,
    timestamp,
    ...props
  }: {
    type: string
    name: string
    content: string
    timestamp: number
  } & React.ComponentPropsWithRef<'div'>) => {
    const nickColor = type === 'message' ? computeNameColor(name) : 'font-normal'
    const contentColor = type === 'message' ? 'text-foreground' : 'text-muted-foreground'
    return (
      <div className="flex" {...props}>
        <div className="flex-none font-medium text-muted-foreground sm:whitespace-pre">
          {formatTimestamp(timestamp)}
          <span className={nickColor}>{formatName(name)}</span>
        </div>
        <div
          className={cn(
            'ml-[1ch] overflow-hidden break-words border-l pl-[1ch] sm:whitespace-pre-wrap',
            contentColor,
          )}
        >
          {formatContent(type, content)}
        </div>
      </div>
    )
  },
)
LogEntryLine.displayName = 'LogItem'

function formatContent(type: string, content: string) {
  switch (type) {
    case 'join':
      return 'joined the channel'
    case 'part':
      return `left the channel (${content})`
    case 'nick':
      return `is now known as ${content}`
    default:
      return linkifyContent(content)
  }
}

function linkifyContent(text: string): React.ReactNode {
  const urlPattern = /(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/gi

  const parts = []
  let lastIndex = 0
  let match

  while ((match = urlPattern.exec(text)) !== null) {
    // Add the text before the URL
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    // Add the URL as a link
    parts.push(
      <a
        key={match.index}
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
        onClick={(e) => e.stopPropagation()}
      >
        {match[0]}
      </a>,
    )
    lastIndex = urlPattern.lastIndex
  }
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp)
    .toLocaleString('en-CA', {
      hour12: false,
    })
    .replace(',', '')
}

const nameColors = [
  'text-red-500',
  'text-orange-500',
  'text-amber-500',
  'text-yellow-500',
  'text-lime-500',
  'text-green-500',
  'text-emerald-500',
  'text-teal-500',
  'text-cyan-500',
  'text-sky-500',
  'text-blue-500',
  'text-indigo-500',
  'text-violet-500',
  'text-purple-500',
  'text-fuchsia-500',
  'text-pink-500',
  'text-rose-500',
]

function computeNameColor(name: string): string {
  const normalizedName = name.toLowerCase()
  let hash = 0

  for (let i = 0; i < normalizedName.length; i++) {
    hash = (hash << 5) - hash + normalizedName.charCodeAt(i)
    hash = hash & hash
  }

  return nameColors[Math.abs(hash) % nameColors.length]
}

function formatName(name: string): string {
  return name.length > 18 ? `${name.slice(0, 18)}…` : name.padStart(19)
}
