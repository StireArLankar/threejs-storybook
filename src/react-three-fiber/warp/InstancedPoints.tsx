import React, { useMemo, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

export interface InstancedPointsProps {
  length: number
  texture: THREE.Texture
}

export const InstancedPoints = (props: InstancedPointsProps) => {
  const { length, texture } = props

  const meshRef = useRef<any>()

  const geometry = useMemo(() => {
    const starGeo = new THREE.Geometry()

    for (let i = 0; i < length; i++) {
      const star = new THREE.Vector3(
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500
      ) as any

      star.velocity = 0
      star.acceleration = 0.02
      starGeo.vertices.push(star)
    }

    return starGeo
  }, [length])

  useFrame(() => {
    const mesh = meshRef.current

    geometry.vertices.forEach((p: any) => {
      p.velocity += p.acceleration
      p.z += p.velocity

      if (p.z > 200) {
        p.z = -500 - 200 * Math.random()
        p.velocity = 0
      }
    })

    geometry.verticesNeedUpdate = true
    mesh.rotation.z += 0.002
  })

  return (
    <points ref={meshRef}>
      <primitive object={geometry} attach='geometry' />
      <pointsMaterial attach='material' map={texture} color='#aaaaaa' size={0.7} />
    </points>
  )
}
