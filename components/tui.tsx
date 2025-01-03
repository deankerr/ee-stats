import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const boxVariants = cva('border-primary inline-flex px-[1ch] py-px justify-between gap-[3ch] text-primary', {
  variants: {
    variant: {
      default: 'border py-[3px] px-[1.25ch]',
      heavy: 'border-4',
      double: 'border-4 border-double',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function TUIBox({
  className,
  variant,
  children,
}: React.ComponentPropsWithRef<'div'> & VariantProps<typeof boxVariants>) {
  return <div className={cn(boxVariants({ variant, className }))}>{children}</div>
}

const spinnerVariants = {
  line: ['—\\|/', 'animate-step-up-4'],
  dots: ['⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏', 'animate-step-up-10'],
}

export function TUISpinner({ variant = 'line' }: { variant?: keyof typeof spinnerVariants }) {
  const [chars, animation] = spinnerVariants[variant]

  return (
    <div className="pointer-events-none h-[1lh] flex-none select-none overflow-hidden" aria-hidden>
      <div className={cn('whitespace-pre', animation)}>
        {chars
          .split('')
          .map((char) => `${char}\n`)
          .join('')}
      </div>
    </div>
  )
}
