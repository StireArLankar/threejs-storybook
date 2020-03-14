import * as THREE from 'three'
import React, { useRef, useMemo, memo } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import lerp from '../../utils/lerp'
//@ts-ignore
import * as meshline from 'threejs-meshline'

extend(meshline)

const r = (radius: number) => radius * Math.max(0.2, Math.random())

export interface FatlineProps {
  curve: any
  width: number
  color: string
  speed: number
}

const Fatline = (props: FatlineProps) => {
  const { curve, width, color, speed } = props
  const material = useRef<any>()

  useFrame(() => {
    material.current.uniforms.dashOffset.value -= speed
  })

  return (
    <mesh>
      //@ts-ignore
      <meshLine attach='geometry' vertices={curve} />
      //@ts-ignore
      <meshLineMaterial
        attach='material'
        ref={material}
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={0.1}
        dashRatio={0.95}
      />
    </mesh>
  )
}

export interface SparksProps {
  count: number
  colors: string[]
  mouse: {
    current: [number, number]
  }
  radius?: number
}

export const Sparks = memo((props: SparksProps) => {
  const { mouse, count, colors, radius = 10 } = props

  const lines = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const pos = new THREE.Vector3(Math.sin(0) * r(radius), Math.cos(0) * r(radius), 0)

        const points = Array.from({ length: 30 }, (_, index) => {
          const angle = (index / 20) * Math.PI * 2

          return pos
            .add(new THREE.Vector3(Math.sin(angle) * r(radius), Math.cos(angle) * r(radius), 0))
            .clone()
        })

        const curve = new THREE.CatmullRomCurve3(points).getPoints(1000)

        return {
          color: colors[Math.floor(colors.length * Math.random())],
          width: Math.max(0.1, (0.2 * index) / 10),
          speed: Math.max(0.001, 0.004 * Math.random()),
          curve,
        }
      }),
    [count, colors, radius]
  )

  const ref = useRef<any>()

  const { viewport } = useThree()

  const aspect = viewport.factor

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = lerp(ref.current.rotation.x, mouse.current[1] / (aspect * 200), 0.1)
      ref.current.rotation.y = lerp(ref.current.rotation.y, mouse.current[0] / (aspect * 400), 0.1)
    }
  })

  return (
    <group ref={ref}>
      <group position={[-radius * 2, -radius, -10]} scale={[1, 1.3, 1]}>
        {lines.map((props, index) => (
          <Fatline key={index} {...props} />
        ))}
      </group>
    </group>
  )
})
