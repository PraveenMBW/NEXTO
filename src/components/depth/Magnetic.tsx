import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useSpring } from 'motion/react'
import { clamp } from '../../lib/math'
import { useCapabilities } from '../../providers/CapabilitiesProvider'
import { cn } from '../../lib/cn'

const SPRING = { stiffness: 220, damping: 18, mass: 0.5 }

type MagneticProps = {
  children: ReactNode
  /** Fraction of the pointer offset the element follows. */
  strength?: number
  /** Hard limit on travel, in px. */
  max?: number
  className?: string
}

/** Pulls its child gently toward the cursor; springs back on leave. */
export function Magnetic({ children, strength = 0.3, max = 12, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { pointerDepth } = useCapabilities()
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  useEffect(() => {
    const el = ref.current
    if (!el || !pointerDepth) return

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      x.set(clamp(dx * strength, -max, max))
      y.set(clamp(dy * strength, -max, max))
    }
    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [pointerDepth, strength, max, x, y])

  return (
    <motion.span ref={ref} style={{ x, y }} className={cn('inline-block', className)}>
      {children}
    </motion.span>
  )
}
