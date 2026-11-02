import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

/** 1440px max width with responsive side gutters (16 / 32 / 48px). */
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12', className)} {...rest} />
  )
}
