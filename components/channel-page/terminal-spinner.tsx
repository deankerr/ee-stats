import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

type ProgressIndicatorStyle = {
  frames: string[]
  interval: number
}

const styles = {
  dots1: {
    frames: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
    interval: 99,
  },
  dots2: {
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    interval: 99,
  },
  dots3: {
    frames: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
    interval: 99,
  },
  dots4: {
    frames: ['⠄', '⠆', '⠇', '⠋', '⠙', '⠸', '⠰', '⠠', '⠰', '⠸', '⠙', '⠋', '⠇', '⠆'],
    interval: 99,
  },
  dots5: {
    frames: ['⠋', '⠙', '⠚', '⠒', '⠂', '⠂', '⠒', '⠲', '⠴', '⠦', '⠖', '⠒', '⠐', '⠐', '⠒', '⠓', '⠋'],
    interval: 99,
  },
  dots6: {
    frames: [
      '⠁',
      '⠉',
      '⠙',
      '⠚',
      '⠒',
      '⠂',
      '⠂',
      '⠒',
      '⠲',
      '⠴',
      '⠤',
      '⠄',
      '⠄',
      '⠤',
      '⠴',
      '⠲',
      '⠒',
      '⠂',
      '⠂',
      '⠒',
      '⠚',
      '⠙',
      '⠉',
      '⠁',
    ],
    interval: 99,
  },
  dots7: {
    frames: [
      '⠈',
      '⠉',
      '⠋',
      '⠓',
      '⠒',
      '⠐',
      '⠐',
      '⠒',
      '⠖',
      '⠦',
      '⠤',
      '⠠',
      '⠠',
      '⠤',
      '⠦',
      '⠖',
      '⠒',
      '⠐',
      '⠐',
      '⠒',
      '⠓',
      '⠋',
      '⠉',
      '⠈',
    ],
    interval: 99,
  },
  dots8: {
    frames: [
      '⠁',
      '⠁',
      '⠉',
      '⠙',
      '⠚',
      '⠒',
      '⠂',
      '⠂',
      '⠒',
      '⠲',
      '⠴',
      '⠤',
      '⠄',
      '⠄',
      '⠤',
      '⠠',
      '⠠',
      '⠤',
      '⠦',
      '⠖',
      '⠒',
      '⠐',
      '⠐',
      '⠒',
      '⠓',
      '⠋',
      '⠉',
      '⠈',
      '⠈',
    ],
    interval: 99,
  },
  dots9: {
    frames: ['⢹', '⢺', '⢼', '⣸', '⣇', '⡧', '⡗', '⡏'],
    interval: 99,
  },
  dots10: {
    frames: ['⢄', '⢂', '⢁', '⡁', '⡈', '⡐', '⡠'],
    interval: 99,
  },
  dots11: {
    frames: ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    interval: 99,
  },
  old: {
    frames: ['—', '\\', '|', '/'],
    interval: 100,
  },
} satisfies Record<string, ProgressIndicatorStyle>

const useInterval = (callback: () => void, delay: null | number) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) {
      return undefined
    }

    const id = setInterval(() => savedCallback.current(), delay)

    return () => {
      clearInterval(id)
    }
  }, [delay])
}

export const TerminalSpinner = ({ type }: { type: keyof typeof styles }) => {
  const { frames, interval } = styles[type]

  const [index, setIndex] = useState<number>(0)

  useInterval(() => {
    setIndex((index + 1) % frames.length)
  }, interval)

  return (
    <span className="pointer-events-none -translate-y-0.5 select-none" aria-hidden>
      {frames[index]}
    </span>
  )
}

export function LoadingTerminalSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto w-fit whitespace-pre border border-primary px-[1ch] text-center text-primary',
        className,
      )}
    >
      <TerminalSpinner type="old" />
      {'   LOADING   '}
      <TerminalSpinner type="old" />
    </div>
  )
}
