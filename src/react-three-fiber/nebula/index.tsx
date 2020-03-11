import React, { memo, useState, Suspense, useRef } from 'react'
import { Canvas, useUpdate, useLoader, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { InstancedClouds } from './InstancedClouds'

const Clouds = () => {
  const smoke = useLoader(THREE.TextureLoader, process.env.PUBLIC_URL + '/assets/smoke.png')

  const renderClouds = () => Array.from({ length: 50 }, (_, k) => <Cloud texture={smoke} key={k} />)

  return <group>{renderClouds()}</group>
}

const Clouds2 = () => {
  const smoke = useLoader(THREE.TextureLoader, process.env.PUBLIC_URL + '/assets/smoke.png')

  return <InstancedClouds texture={smoke} length={50} />
}

interface CloudProps {
  texture: THREE.Texture
}

const Cloud = memo((props: CloudProps) => {
  const { texture } = props

  const ref = useRef<any>()

  useFrame(() => {
    ref.current.rotation.z -= 0.001
  })

  return (
    <mesh
      rotation={[1.16, -0.12, Math.random() * 2 * Math.PI]}
      position={[Math.random() * 800 - 400, 500, Math.random() * 500 - 500]}
      ref={ref}
    >
      <planeBufferGeometry attach='geometry' args={[500, 500]} />
      <meshLambertMaterial attach='material' map={texture} transparent opacity={0.55} />
    </mesh>
  )
})

export default () => {
  return (
    <Canvas
      camera={{ position: [0, 5, 1], rotation: [1.16, -0.12, 0.27] }}
      style={{ backgroundColor: 'rgb(6, 82, 78)' }}
    >
      <Suspense fallback={null}>
        <Clouds />
      </Suspense>
      <ambientLight args={['#555555']} />
      <directionalLight args={['#ff8c19']} position={[0, 0, 1]} />
      <pointLight args={['#cc6600', 50, 450, 1.7]} position={[200, 200, 100]} />
      <pointLight args={['#d8547e', 50, 450, 1.7]} position={[100, 300, 100]} />
      <pointLight args={['#3677ac', 50, 450, 1.7]} position={[300, 300, 200]} />
      //@ts-ignore
      <fog attach='fog' args={['#03544e', 0.001]} />
    </Canvas>
  )
}
