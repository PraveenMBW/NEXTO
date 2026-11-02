import { useCallback } from 'react'
import { useCapabilities } from '../providers/CapabilitiesProvider'
import { useLenis } from '../providers/SmoothScrollProvider'

/**
 * Scroll to an in-page anchor ("#about") through Lenis when it is running,
 * natively otherwise. Moves focus to the target so keyboard and screen-reader
 * users land in the right place.
 */
export function useScrollTo() {
  const lenis = useLenis()
  const { reducedMotion } = useCapabilities()

  return useCallback(
    (hash: string) => {
      const target = hash === '#top' ? null : document.querySelector<HTMLElement>(hash)
      if (hash !== '#top' && !target) return

      if (lenis) {
        lenis.scrollTo(target ?? 0, { duration: 1.4, force: true })
      } else {
        const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth'
        if (target) target.scrollIntoView({ behavior })
        else window.scrollTo({ top: 0, behavior })
      }

      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }
      history.replaceState(null, '', window.location.pathname + window.location.search + (hash === '#top' ? '' : hash))
    },
    [lenis, reducedMotion],
  )
}
