import { useRef, type HTMLAttributes } from 'react'
import { gsap, MQ, useGSAP } from '../../lib/gsap'

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number
  /** Distance in px the element rises from. */
  distance?: number
}

/** Fades and lifts its content into place once, when it enters the viewport. */
export function Reveal({ delay = 0, distance = 32, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MQ.motionOK, () => {
        gsap.from(ref.current, {
          opacity: 0,
          y: distance,
          duration: 1.1,
          delay,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        })
      })
    },
    { scope: ref },
  )

  return <div ref={ref} {...rest} />
}
