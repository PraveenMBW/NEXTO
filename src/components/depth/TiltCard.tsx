import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { cn } from '../../lib/cn'
import { useCapabilities } from '../../providers/CapabilitiesProvider'

const SPRING = { stiffness: 150, damping: 18, mass: 0.5 }

type TiltCardProps = {
  children: ReactNode
  className?: string
  /** Maximum tilt in degrees. */
  max?: number
}

/**
 * A card that tilts toward the pointer in real 3D (perspective +
 * preserve-3d). Children can sit at different depths with
 * `[transform:translateZ(..px)]`. A soft glare follows the pointer.
 * Static on touch devices and under reduced motion.
 */
export function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { pointerDepth } = useCapabilities()

  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useSpring(0, SPRING)
  const glare = useMotionTemplate`radial-gradient(480px circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.09), transparent 60%)`

  useEffect(() => {
    const el = ref.current
    if (!el || !pointerDepth) return

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      rotateY.set((px - 0.5) * 2 * max)
      rotateX.set(-(py - 0.5) * 2 * max)
      glareX.set(px * 100)
      glareY.set(py * 100)
      glareOpacity.set(1)
    }
    const onLeave = () => {
      rotateX.set(0)
      rotateY.set(0)
      glareOpacity.set(0)
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [pointerDepth, max, rotateX, rotateY, glareX, glareY, glareOpacity])

  return (
    <div ref={ref} className="h-full [perspective:1100px]">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('relative h-full', className)}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glare, opacity: glareOpacity }}
        />
      </motion.div>
    </div>
  )
}
