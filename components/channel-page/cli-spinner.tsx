import { cn } from '@/lib/utils'

const cliSpinners = {
  slash: <div className="w-max animate-step-left-4 group-aria-hidden:animate-none">—\|/</div>,
  dots: <div className="w-max animate-step-left-10 group-aria-hidden:animate-none">⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏</div>,
} as const

function CLISpinner({ variant }: { variant: keyof typeof cliSpinners }) {
  return (
    <div className="pointer-events-none w-2.5 flex-none select-none overflow-hidden text-base" aria-hidden>
      {cliSpinners[variant]}
    </div>
  )
}

export function CLILoadingSpinner({
  spinner = 'slash',
  border = 'default',
  enabled = true,
  className,
  children,
  ...props
}: {
  spinner?: 'slash' | 'dots'
  border?: 'default' | 'double' | 'strong'
  enabled?: boolean
} & React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'group flex h-fit w-fit items-center justify-between gap-[3ch] border border-primary px-[1ch] py-px text-primary',
        border === 'double' && 'border-4 border-double py-0.5',
        border === 'strong' && 'border-[3px] py-0.5',
        enabled ? 'visible' : 'invisible',
        className,
      )}
      aria-hidden={!enabled}
      {...props}
    >
      <CLISpinner variant={spinner} />
      {children ?? 'LOADING'}
      <CLISpinner variant={spinner} />
    </div>
  )
}
