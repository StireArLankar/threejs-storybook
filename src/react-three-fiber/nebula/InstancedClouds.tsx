import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'

const object3D = new THREE.Object3D()

export interface InstancedCloudsProps {
  length: number
  texture: THREE.Texture
}

export const InstancedClouds = (props: InstancedCloudsProps) => {
  const { length, texture } = props

  const meshRef = useRef<any>()

  useEffect(() => {
    const mesh = meshRef.current

    for (let i = 0; i < length; ++i) {
      const x = Math.random() * 800 - 400
      const y = 500
      const z = Math.random() * 500 - 500

      object3D.position.set(x, y, z)
      object3D.rotation.set(1.16, -0.12, Math.random() * 2 * Math.PI)
      object3D.updateMatrix()
      mesh.setMatrixAt(i, object3D.matrix)

      mesh.instanceMatrix.needsUpdate = true
    }
  }, [length])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const mesh = meshRef.current

    for (let i = 0; i < length; ++i) {
      object3D.rotation.set(1.16, -0.12, Math.sin(i / 10 + time / 100))
      object3D.updateMatrix()
      mesh.setMatrixAt(i, object3D.matrix)

      mesh.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, length] as any}>
      <planeBufferGeometry attach='geometry' args={[500, 500]} />
      <meshLambertMaterial attach='material' map={texture} transparent opacity={0.55} />
    </instancedMesh>
  )
}
