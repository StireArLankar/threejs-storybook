import React, { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import { vector } from '../../utils'

const object3D = new THREE.Object3D()

export interface InstancedCloudsProps {
  length: number
  texture: THREE.Texture
}

export const InstancedClouds = (props: InstancedCloudsProps) => {
  const { length, texture } = props

  const meshRef = useRef<any>()

  const rotations = useRef(Array.from({ length }, (_, k) => Math.random() * 2 * Math.PI))

  const positions = useMemo(() => {
    const arr: vector[] = []
    for (let i = 0; i < length; i++) {
      const x = Math.random() * 800 - 400
      const y = 500
      const z = Math.random() * 500 - 500

      arr.push([x, y, z])
    }

    return arr
  }, [length])

  useEffect(() => {
    const mesh = meshRef.current

    for (let i = 0; i < length; i++) {
      object3D.position.set(...positions[i])
      object3D.rotation.set(1.16, -0.12, rotations.current[i])
      object3D.updateMatrix()
      mesh.setMatrixAt(i, object3D.matrix)

      mesh.instanceMatrix.needsUpdate = true
    }
  }, [length, positions])

  useFrame(() => {
    const mesh = meshRef.current

    for (let i = 0; i < length; i++) {
      object3D.position.set(...positions[i])
      object3D.rotation.set(1.16, -0.12, (rotations.current[i] -= 0.001))
      object3D.updateMatrix()
      mesh.setMatrixAt(i, object3D.matrix)

      mesh.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, length] as any} position={[0, 0, 0]}>
      <planeBufferGeometry attach='geometry' args={[500, 500]} />
      <meshLambertMaterial
        attach='material'
        map={texture}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
