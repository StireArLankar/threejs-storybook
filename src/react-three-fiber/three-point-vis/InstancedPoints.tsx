import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

const object3D = new THREE.Object3D()

export interface InstancedPointsProps {
  data: Array<{ id: number }>
}

export const InstancedPoints = (props: InstancedPointsProps) => {
  const { data } = props

  const meshRef = useRef<any>()
  const numPoints = data.length

  useEffect(() => {
    const mesh = meshRef.current

    for (let i = 0; i < numPoints; ++i) {
      const x = (i % 30) * 1.05
      const y = Math.floor(i / 30) * 1.05
      const z = 0

      object3D.position.set(x, y, z)
      object3D.rotation.set(Math.PI / 2, 0, 0)
      object3D.updateMatrix()
      mesh.setMatrixAt(i, object3D.matrix)

      mesh.instanceMatrix.needsUpdate = true
    }
  }, [numPoints])

  return (
    <instancedMesh ref={meshRef} args={[null, null, numPoints] as any} frustumCulled={false}>
      <cylinderBufferGeometry attach='geometry' args={[0.5, 0.5, 0.15, 32]} />
      <meshStandardMaterial attach='material' color='#fff' />
    </instancedMesh>
  )
}
