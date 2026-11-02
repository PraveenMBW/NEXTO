import Lenis from 'lenis'
import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useCapabilities } from './CapabilitiesProvider'

const LenisContext = createContext<Lenis | null>(null)

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so Lenis and every
 * ScrollTrigger advance in the same animation frame (no drift, no jitter).
 * Under prefers-reduced-motion Lenis is not created at all: native scrolling,
 * keyboard and assistive-tech behaviour stay untouched.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useCapabilities()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion) return

    const instance = new Lenis({ lerp: 0.1, autoRaf: false })
    instance.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      instance.destroy()
      setLenis(null)
    }
  }, [reducedMotion])

  // Trigger positions depend on final layout: re-measure once web fonts and
  // images have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return <LenisContext value={lenis}>{children}</LenisContext>
}

/** The Lenis instance, or null when smooth scrolling is disabled. */
export function useLenis(): Lenis | null {
  return use(LenisContext)
}
