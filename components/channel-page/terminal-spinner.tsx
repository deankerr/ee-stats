import { cn } from '@/lib/utils'

const cliSpinners = {
  slash: <div className="animate-step-left-4 w-max">—\|/</div>,
  dots: <div className="animate-step-left-10 w-max">⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏</div>,
} as const

function CLISpinner({ variant }: { variant: keyof typeof cliSpinners }) {
  return (
    <div className="pointer-events-none w-2.5 flex-none select-none overflow-hidden text-base" aria-hidden>
      {cliSpinners[variant]}
    </div>
  )
}

export function CLILoadingSpinners({
  className,
  spinner = 'slash',
  border = 'default',
}: {
  className?: string
  spinner?: 'slash' | 'dots'
  border?: 'default' | 'double' | 'strong'
}) {
  return (
    <div
      className={cn(
        'flex h-fit w-fit items-center justify-between gap-[3ch] border border-primary px-[1ch] py-px text-primary',
        border === 'double' && 'border-4 border-double py-0.5',
        border === 'strong' && 'border-[3px] py-0.5',
        className,
      )}
    >
      <CLISpinner variant={spinner} />
      LOADING
      <CLISpinner variant={spinner} />
    </div>
  )
}

// className={cn('mx-auto w-fit whitespace-pre border border-primary px-3 py-1 text-primary', className)}
