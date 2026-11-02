import { motion, useTransform, type HTMLMotionProps } from 'motion/react'
import { usePointerDepth } from '../../hooks/usePointerDepth'

type PointerLayerProps = HTMLMotionProps<'div'> & {
  /** 0 = pinned to the screen, 1 = nearest layer (moves the most). */
  depth: number
  /** Maximum translation in px at depth 1. */
  strength?: number
  /** Maximum rotation in degrees at depth 1. */
  tilt?: number
}

/**
 * A layer that drifts with the pointer inside the nearest <DepthScene>.
 * Only transforms are written (GPU-composited, no layout).
 *
 * Don't put this on an element GSAP also transforms — wrap it instead
 * (outer element: GSAP scroll, inner element: pointer).
 */
export function PointerLayer({
  depth,
  strength = 24,
  tilt = 0,
  style,
  ...rest
}: PointerLayerProps) {
  const { x, y } = usePointerDepth()
  const translateX = useTransform(x, (v) => v * strength * depth)
  const translateY = useTransform(y, (v) => v * strength * depth)
  const rotateY = useTransform(x, (v) => v * tilt * depth)
  const rotateX = useTransform(y, (v) => -v * tilt * depth)

  return (
    <motion.div
      style={{ x: translateX, y: translateY, rotateX, rotateY, ...style }}
      {...rest}
    />
  )
}
