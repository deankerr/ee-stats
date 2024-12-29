import { memo } from 'react'

export const LogEntry = memo(
  ({ name, content, timestamp }: { name: string; content: string; timestamp: number }) => {
    return (
      <div className="flex snap-start">
        <div className="flex-none whitespace-pre font-medium text-muted-foreground">
          {formatTimestamp(timestamp)}
          <span className={computeNameColor(name)}>{formatName(name)}</span>
        </div>
        <div className="ml-[1ch] overflow-hidden break-words border-l pl-[1ch]">{content}</div>
      </div>
    )
  },
)
LogEntry.displayName = 'LogItem'

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
