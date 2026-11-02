import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import type { MotionValue } from 'motion/react'
import { LayeredMonolith } from './LayeredMonolith'

type HeroCanvasProps = {
  progress: MotionValue<number>
  /** False when the hero is off-screen: rendering stops entirely. */
  active: boolean
  reducedMotion: boolean
  onReady: () => void
}

const MAX_DPR = 1.75

/**
 * Lazily-loaded (own chunk). Lighting is a procedural environment built from
 * Lightformers once at startup — no HDR download.
 */
export default function HeroCanvas({ progress, active, reducedMotion, onReady }: HeroCanvasProps) {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, MAX_DPR))

  return (
    <Canvas
      frameloop={!active ? 'never' : reducedMotion ? 'demand' : 'always'}
      dpr={dpr}
      camera={{ position: [0, 0, 8.4], fov: 35, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      onCreated={() => requestAnimationFrame(() => requestAnimationFrame(onReady))}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} />

      <LayeredMonolith progress={progress} animate={!reducedMotion} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 3]} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={3} color="#8b7cff" position={[-5, 0, 2]} scale={[1.5, 8, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ff8a4c" position={[5, -1, 1]} scale={[1.2, 6, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[0, 0, -6]} scale={6} />
      </Environment>
    </Canvas>
  )
}
