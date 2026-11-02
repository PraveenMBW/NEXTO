import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { MotionValue } from 'motion/react'
import { Color, MeshPhysicalMaterial, MeshStandardMaterial, type Group } from 'three'
import { usePointerDepth } from '../../hooks/usePointerDepth'

/*
 * An abstract "N" built from three bars (two uprights + diagonal), repeated as
 * three stacked planes along Z: a glass front plane and two iris "echo"
 * planes behind it. Pointer rotation reveals the parallax between planes;
 * scrolling pulls the planes apart.
 *
 * 9 low-poly meshes, 2 shared materials, no shadows, no textures.
 */

const BAR_WIDTH = 0.5
const UPRIGHT_HEIGHT = 2.7
const HALF_SPAN = 0.95
const DIAGONAL_ANGLE = Math.atan((HALF_SPAN * 2) / UPRIGHT_HEIGHT)
const DIAGONAL_LENGTH = 3.0

const BARS: Array<{ position: [number, number, number]; rotationZ: number; height: number }> = [
  { position: [-HALF_SPAN, 0, 0], rotationZ: 0, height: UPRIGHT_HEIGHT },
  { position: [0, 0, 0.12], rotationZ: DIAGONAL_ANGLE, height: DIAGONAL_LENGTH },
  { position: [HALF_SPAN, 0, 0], rotationZ: 0, height: UPRIGHT_HEIGHT },
]

// Front glass plane, then two echoes receding into the scene.
const PLANES = [
  { z: 0.45, kind: 'glass' as const, depth: 0.16 },
  { z: -0.35, kind: 'echo' as const, depth: 0.06 },
  { z: -1.05, kind: 'echo-far' as const, depth: 0.04 },
]

type LayeredMonolithProps = {
  /** Hero scroll progress 0 → 1. */
  progress: MotionValue<number>
  /** Idle float + pointer response. Off under reduced motion. */
  animate: boolean
}

export function LayeredMonolith({ progress, animate }: LayeredMonolithProps) {
  const root = useRef<Group>(null)
  const planes = useRef<Array<Group | null>>([])
  const { x, y } = usePointerDepth()

  const materials = useMemo(
    () => ({
      glass: new MeshPhysicalMaterial({
        color: new Color('#e6e2ff'),
        transmission: 1,
        thickness: 0.6,
        roughness: 0.18,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        attenuationColor: new Color('#b7adff'),
        attenuationDistance: 2.2,
        envMapIntensity: 1.3,
      }),
      echo: new MeshStandardMaterial({
        color: new Color('#8b7cff'),
        emissive: new Color('#5b4ad6'),
        emissiveIntensity: 0.55,
        roughness: 0.35,
        metalness: 0.1,
      }),
      'echo-far': new MeshStandardMaterial({
        color: new Color('#2a2363'),
        emissive: new Color('#3a2f99'),
        emissiveIntensity: 0.35,
        roughness: 0.6,
        transparent: true,
        opacity: 0.7,
      }),
    }),
    [],
  )

  useFrame((state) => {
    const group = root.current
    if (!group) return

    const t = animate ? state.clock.elapsedTime : 0
    const px = animate ? x.get() : 0
    const py = animate ? y.get() : 0
    const p = progress.get()

    // Resting three-quarter view so the stacked planes read as depth.
    group.rotation.y = -0.42 + px * 0.32 + Math.sin(t * 0.25) * 0.05
    group.rotation.x = 0.06 + py * 0.16 + p * 0.25
    group.position.y = 0.2 + Math.sin(t * 0.6) * 0.05 + p * 0.4

    // Scroll pulls the planes apart along Z.
    const spread = 1 + p * 2.4
    planes.current.forEach((plane, index) => {
      if (plane) plane.position.z = PLANES[index].z * spread
    })
  })

  return (
    <group ref={root}>
      {PLANES.map((plane, planeIndex) => (
        <group
          key={plane.kind}
          ref={(node) => {
            planes.current[planeIndex] = node
          }}
          position-z={plane.z}
        >
          {BARS.map((bar, barIndex) => (
            <RoundedBox
              key={barIndex}
              args={[BAR_WIDTH, bar.height, plane.depth]}
              radius={Math.min(0.06, plane.depth / 2.2)}
              smoothness={3}
              position={bar.position}
              rotation-z={bar.rotationZ}
              material={materials[plane.kind]}
            />
          ))}
        </group>
      ))}
    </group>
  )
}
