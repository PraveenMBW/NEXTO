import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

/** Mono uppercase eyebrow, e.g. "(01) — About". */
export function SectionLabel({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'font-mono text-[0.75rem] uppercase tracking-[0.12em] text-bone-400',
        className,
      )}
      {...rest}
    />
  )
}
