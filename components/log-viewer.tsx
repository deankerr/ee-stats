import type { LogEvent } from '@/convex/events'
import { cn } from '@/lib/utils'
import { FileQuestionIcon, InfoIcon, MessageCircleIcon } from 'lucide-react'

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date
    .toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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

function getNameColor(nick: string): string {
  return nameColors[Number.parseInt(nick.replaceAll(/[^a-zA-Z0-9]/g, ''), 36) % nameColors.length]
}

export function LogViewer({ items }: { items: LogEvent[] }) {
  return (
    <>
      {items.map((item) => {
        return (
          <div key={item._id} className="flex gap-4 px-2">
            <div className="flex-none text-muted-foreground">{formatTimestamp(item.timestamp)}</div>
            <div
              className={cn(getNameColor(item.name), 'whitespace-pre font-medium flex-none min-w-[16ch] text-right')}
            >
              {item.name}
            </div>
            <div>{item.content}</div>
          </div>
        )
      })}
    </>
  )
}

export function LogItemIcon({ category }: { category: string }) {
  const categoryIcons: Record<string, React.ElementType> = {
    message: MessageCircleIcon,
    status: InfoIcon,
  }

  const Icon = categoryIcons[category] ?? FileQuestionIcon
  return <Icon className="size-5" />
}
