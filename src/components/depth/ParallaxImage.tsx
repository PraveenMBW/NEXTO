import { useRef } from 'react'
import { cn } from '../../lib/cn'
import { gsap, MQ, useGSAP } from '../../lib/gsap'
import { Picture } from '../ui/Picture'

type ParallaxImageProps = {
  name: string
  sizes: string
  alt?: string
  /** Frame classes — set the aspect ratio / size here. */
  className?: string
  /** Inner image drift as % of its height (each direction). */
  amount?: number
  /** Extra classes for the <img> (e.g. hover scale — uses the CSS `scale`
   *  property, so it composes with GSAP's transform). */
  imgClassName?: string
}

/**
 * An image that drifts inside its frame as the frame crosses the viewport —
 * the frame moves with the page, the picture moves slower: depth inside depth.
 */
export function ParallaxImage({
  name,
  sizes,
  alt = '',
  className,
  amount = 7,
  imgClassName,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MQ.motionOK, () => {
        gsap.fromTo(
          '[data-parallax-img]',
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={cn('relative overflow-hidden bg-ink-800', className)}>
      <Picture
        data-parallax-img
        name={name}
        sizes={sizes}
        alt={alt}
        className={cn('absolute inset-x-0 top-[-10%] h-[120%] w-full object-cover', imgClassName)}
      />
    </div>
  )
}
