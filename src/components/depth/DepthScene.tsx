import { useEffect, useMemo, useRef, type HTMLAttributes } from 'react'
import { useMotionValue, useSpring } from 'motion/react'
import { clamp } from '../../lib/math'
import { PointerDepthContext } from '../../hooks/usePointerDepth'
import { useCapabilities } from '../../providers/CapabilitiesProvider'

// Soft, slightly under-damped: layers glide rather than snap.
const SPRING = { stiffness: 120, damping: 20, mass: 0.6 }

/**
 * Tracks the pointer over this element and shares a smoothed, normalised
 * position (-1…1) with every PointerLayer (and R3F scene) inside it.
 *
 * - One native listener per scene; values live in Motion values, so pointer
 *   movement causes zero React renders.
 * - On pointer leave the target returns to 0 and the springs ease layers home.
 * - Disabled on touch / coarse pointers and under prefers-reduced-motion.
 */
export function DepthScene({ children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const { pointerDepth } = useCapabilities()

  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const x = useSpring(targetX, SPRING)
  const y = useSpring(targetY, SPRING)

  useEffect(() => {
    const el = ref.current
    if (!el || !pointerDepth) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = el.getBoundingClientRect()
      targetX.set(clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1))
      targetY.set(clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1))
    }
    const onLeave = () => {
      targetX.set(0)
      targetY.set(0)
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [pointerDepth, targetX, targetY])

  const value = useMemo(() => ({ x, y }), [x, y])

  return (
    <PointerDepthContext value={value}>
      <div ref={ref} {...rest}>
        {children}
      </div>
    </PointerDepthContext>
  )
}
