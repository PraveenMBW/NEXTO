import { useRef, type ReactNode } from 'react'
import { gsap, MQ, useGSAP } from '../../lib/gsap'
import { Picture } from '../ui/Picture'

type ExpandingMediaProps = {
  name: string
  alt?: string
  /** Overlay content (caption) — fades in once the media is full-bleed. */
  children?: ReactNode
}

/**
 * Starts as an inset, rounded card and opens to full-bleed as it scrolls
 * into view, while the picture inside settles from a slight zoom.
 * Uses clip-path (no layout changes), so surrounding content never moves.
 */
export function ExpandingMedia({ name, alt = '', children }: ExpandingMediaProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(
        { mobile: MQ.mobile, motionOK: MQ.motionOK },
        (context) => {
          const { mobile, motionOK } = context.conditions ?? {}
          if (!motionOK) return
          const inset = mobile ? '6% 4% round 16px' : '12% 16% round 28px'

          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 90%',
                end: 'center 55%',
                scrub: true,
              },
            })
            .fromTo(
              '[data-media-frame]',
              { clipPath: `inset(${inset})` },
              { clipPath: 'inset(0% 0% round 0px)', duration: 1 },
              0,
            )
            .fromTo('[data-media-img]', { scale: 1.25 }, { scale: 1, duration: 1 }, 0)
            .from('[data-media-caption]', { opacity: 0, y: 24, duration: 0.3 }, 0.7)
        },
      )
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="relative">
      <div data-media-frame className="relative h-[70svh] overflow-hidden bg-ink-800 md:h-[88svh]">
        <Picture
          data-media-img
          name={name}
          alt={alt}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
        <div data-media-caption className="absolute inset-x-0 bottom-0">
          {children}
        </div>
      </div>
    </div>
  )
}
