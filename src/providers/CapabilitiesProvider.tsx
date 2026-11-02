import { createContext, use, useMemo, useState, type ReactNode } from 'react'
import {
  detectLowPower,
  detectSaveData,
  detectWebGL,
  heroOverride,
} from '../lib/capabilities'
import { useMediaQuery } from '../hooks/useMediaQuery'

export type Capabilities = {
  /** User asked the OS for reduced motion. */
  reducedMotion: boolean
  /** Precise pointer that can hover (mouse / trackpad / pen). */
  finePointer: boolean
  /** Pointer-driven depth, tilt and magnetic effects are allowed. */
  pointerDepth: boolean
  /** Render the real-time WebGL hero instead of the static fallback. */
  render3D: boolean
}

const CapabilitiesContext = createContext<Capabilities | null>(null)

export function CapabilitiesProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')

  // Hardware checks don't change during a session — compute once.
  const [hardware] = useState(() => ({
    webgl: detectWebGL(),
    lowPower: detectLowPower(),
    saveData: detectSaveData(),
    override: heroOverride(),
  }))

  const value = useMemo<Capabilities>(() => {
    const { webgl, lowPower, saveData, override } = hardware
    const auto = webgl && !lowPower && !saveData
    return {
      reducedMotion,
      finePointer,
      pointerDepth: finePointer && !reducedMotion,
      render3D: override ? override === '3d' && webgl : auto,
    }
  }, [hardware, reducedMotion, finePointer])

  return <CapabilitiesContext value={value}>{children}</CapabilitiesContext>
}

export function useCapabilities(): Capabilities {
  const ctx = use(CapabilitiesContext)
  if (!ctx) throw new Error('useCapabilities must be used inside <CapabilitiesProvider>')
  return ctx
}
