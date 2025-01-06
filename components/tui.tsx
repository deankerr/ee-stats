import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const boxVariants = cva('border-primary px-[1ch] py-px text-primary', {
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
  ...props
}: React.ComponentPropsWithRef<'div'> & VariantProps<typeof boxVariants>) {
  return (
    <div className={cn(boxVariants({ variant, className }))} {...props}>
      {children}
    </div>
  )
}

const spinnerVariants = {
  line: ['—\\|/', 'animate-step-up-4'],
  dots: ['⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏', 'animate-step-up-10'],
}

export function TUISpinner({
  variant = 'line',
  className,
  ...props
}: { variant?: keyof typeof spinnerVariants } & React.ComponentPropsWithRef<'div'>) {
  const [chars, animation] = spinnerVariants[variant]

  return (
    <div
      className={cn(
        'pointer-events-none inline-flex h-[1lh] flex-none select-none overflow-hidden',
        className,
      )}
      aria-hidden
      {...props}
    >
      <div className={cn('h-fit whitespace-pre', animation)}>
        {chars
          .split('')
          .map((char) => `${char}\n`)
          .join('')}
      </div>
    </div>
  )
}

export function TUILoading() {
  return (
    <TUIBox variant="double" className="m-auto w-fit text-center">
      <TUISpinner variant="line" />
      <span className="mx-[3ch]">LOADING</span>
      <TUISpinner variant="line" />
    </TUIBox>
  )
}
