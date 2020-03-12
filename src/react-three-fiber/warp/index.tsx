import React, { Suspense } from 'react'
import { Canvas, useLoader } from 'react-three-fiber'
import * as THREE from 'three'
import { InstancedPoints } from './InstancedPoints'

const Stars = () => {
  const star = useLoader(THREE.TextureLoader, process.env.PUBLIC_URL + '/assets/star.png')

  return <InstancedPoints texture={star} length={20000} />
}

export default () => {
  return (
    <Canvas camera={{ fov: 60 }} style={{ backgroundColor: 'black' }}>
      <Suspense fallback={null}>
        <Stars />
      </Suspense>
    </Canvas>
  )
}
