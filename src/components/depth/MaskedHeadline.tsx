import { useRef } from 'react'
import type { HeadlineSegment } from '../../content/site'
import { cn } from '../../lib/cn'
import { gsap, MQ, useGSAP } from '../../lib/gsap'
import { HeadlineLines } from '../ui/HeadlineLines'

type MaskedHeadlineProps = {
  lines: readonly (readonly HeadlineSegment[])[]
  id?: string
  className?: string
}

/** Section headline whose lines slide up out of their masks on enter. */
export function MaskedHeadline({ lines, id, className }: MaskedHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MQ.motionOK, () => {
        gsap.from('[data-line]', {
          yPercent: 115,
          duration: 1.3,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <h2 ref={ref} id={id} className={cn('font-display text-headline font-medium', className)}>
      <HeadlineLines lines={lines} />
    </h2>
  )
}
