import type { AnchorHTMLAttributes } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { SmoothLink } from './SmoothLink'

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md'
}

const VARIANTS = {
  primary: 'bg-iris-400 text-ink-950 hover:bg-iris-300',
  ghost: 'border border-line-strong text-bone-100 hover:border-bone-400 hover:bg-white/[0.04]',
}

const SIZES = {
  sm: 'h-10 px-4 text-sm gap-1.5',
  md: 'h-12 px-6 text-[0.9375rem] gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <SmoothLink
      className={cn(
        'group inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap',
        'transition-colors duration-300',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </SmoothLink>
  )
}
