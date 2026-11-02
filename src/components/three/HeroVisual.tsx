import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import { cn } from '../../lib/cn'
import { useCapabilities } from '../../providers/CapabilitiesProvider'
import { PointerLayer } from '../depth/PointerLayer'

const HeroCanvas = lazy(() => import('./HeroCanvas'))

const whenIdle = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(callback, 300)
  return () => clearTimeout(id)
}

/**
 * The hero's mid-ground. Always paints the static render first (fast LCP, and
 * the permanent fallback for no-WebGL / low-power / save-data devices), then —
 * if allowed — mounts the real-time scene once the browser is idle and
 * cross-fades to it.
 */
export function HeroVisual({ progress }: { progress: MotionValue<number> }) {
  const { render3D, reducedMotion } = useCapabilities()
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(true)

  useEffect(() => (render3D ? whenIdle(() => setMounted(true)) : undefined), [render3D])

  // Stop rendering entirely while the hero is off-screen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0">
      <PointerLayer
        depth={0.5}
        strength={18}
        tilt={3}
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          ready && 'opacity-0',
        )}
      >
        <img
          src="/hero-fallback.webp"
          alt=""
          width={1200}
          height={1200}
          decoding="async"
          fetchPriority="high"
          className="absolute left-1/2 top-1/2 aspect-square h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </PointerLayer>

      {mounted && (
        <Suspense fallback={null}>
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-out',
              ready ? 'opacity-100' : 'opacity-0',
            )}
          >
            <HeroCanvas
              progress={progress}
              active={inView}
              reducedMotion={reducedMotion}
              onReady={() => setReady(true)}
            />
          </div>
        </Suspense>
      )}
    </div>
  )
}
