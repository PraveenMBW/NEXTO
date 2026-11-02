import { useRef, type HTMLAttributes } from 'react'
import { gsap, MQ, useGSAP } from '../../lib/gsap'

type ScrollLayerProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Extra travel as a fraction of the viewport height while the element
   * crosses the screen. Positive = moves faster than the page (feels nearer),
   * negative = slower (feels further away). Keep within ±0.25.
   */
  speed: number
}

/**
 * Scroll-speed parallax layer. Strength is scaled to 70% on tablet and 40% on
 * mobile, and disabled under prefers-reduced-motion.
 */
export function ScrollLayer({ speed, ...rest }: ScrollLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(
        { mobile: MQ.mobile, tablet: MQ.tablet, motionOK: MQ.motionOK },
        (context) => {
          const { mobile, tablet, motionOK } = context.conditions ?? {}
          if (!motionOK) return
          const factor = mobile ? 0.4 : tablet ? 0.7 : 1
          const travel = () => speed * factor * window.innerHeight

          gsap.fromTo(
            ref.current,
            { y: () => travel() / 2 },
            {
              y: () => -travel() / 2,
              ease: 'none',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )
        },
      )
    },
    { scope: ref, dependencies: [speed] },
  )

  return <div ref={ref} {...rest} />
}
