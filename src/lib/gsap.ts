import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register once, app-wide. Every component imports GSAP from here so the
// plugins are guaranteed to be registered before first use.
gsap.registerPlugin(ScrollTrigger, useGSAP)

// Mobile address-bar show/hide changes the viewport height; don't recompute
// every trigger for it (that causes visible jumps on iOS/Android).
ScrollTrigger.config({ ignoreMobileResize: true })

/** Media conditions shared by every gsap.matchMedia() call. */
export const MQ = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  motionOK: '(prefers-reduced-motion: no-preference)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
} as const

export { gsap, ScrollTrigger, useGSAP }
