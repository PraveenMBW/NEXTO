import { createContext, use } from 'react'
import { motionValue, type MotionValue } from 'motion/react'

export type PointerDepth = {
  /** Smoothed pointer x within the scene, -1 (left) … 1 (right). */
  x: MotionValue<number>
  /** Smoothed pointer y within the scene, -1 (top) … 1 (bottom). */
  y: MotionValue<number>
}

// Outside a <DepthScene> layers simply stay at rest.
const AT_REST: PointerDepth = { x: motionValue(0), y: motionValue(0) }

export const PointerDepthContext = createContext<PointerDepth>(AT_REST)

/**
 * Read the nearest DepthScene's pointer values. These are Motion values —
 * reading them never re-renders React; subscribe via useTransform/useFrame.
 */
export function usePointerDepth(): PointerDepth {
  return use(PointerDepthContext)
}
