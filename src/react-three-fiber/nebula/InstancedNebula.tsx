import React, { Suspense } from 'react'
import { Canvas, useLoader } from 'react-three-fiber'
import * as THREE from 'three'
import { InstancedClouds } from './InstancedClouds'

const Clouds2 = () => {
  const smoke = useLoader(THREE.TextureLoader, process.env.PUBLIC_URL + '/assets/smoke.png')

  return <InstancedClouds texture={smoke} length={200} />
}

export default () => {
  return (
    <Canvas
      camera={{ rotation: [1.16, -0.12, 0.27], fov: 60 }}
      style={{ backgroundColor: 'rgb(6, 82, 78)' }}
    >
      <Suspense fallback={null}>
        <Clouds2 />
      </Suspense>
      <ambientLight args={['#555555']} />
      <directionalLight args={['#ff8c19']} position={[0, 0, 1]} />
      <pointLight args={['#cc6600', 50, 450, 1.5]} position={[200, 200, 100]} />
      <pointLight args={['#d8547e', 50, 450, 1.5]} position={[100, 300, 100]} />
      <pointLight args={['#3677ac', 50, 450, 1.5]} position={[300, 300, 200]} />
      //@ts-ignore
      <fog attach='fog' args={['#03544e', 0.01]} />
    </Canvas>
  )
}
