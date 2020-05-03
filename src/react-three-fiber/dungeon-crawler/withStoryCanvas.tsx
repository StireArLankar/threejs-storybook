import React, { useRef } from 'react'
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber'
import * as THREE from 'three'
import { TextureProvider } from './TextureProvider'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

const Controls = () => {
  const { camera, gl } = useThree()
  const ref = useRef<any>()

  useFrame(() => {
    ref.current.update()
  })

  return (
    //@ts-ignore
    <orbitControls args={[camera, gl.domElement]} ref={ref} />
  )
}

const Light = ({ position }: any) => {
  const mesh = new THREE.PointLight(0xffffff)

  return (
    <group>
      <primitive object={mesh} position={position} intensity={0.7} />
      <pointLightHelper args={[mesh, 10, 'white']} />
    </group>
  )
}

export const withStoryCanvas = (storyfn: any) => {
  return (
    <Canvas camera={{ position: [0, 5, 20] }} shadowMap>
      <Controls />
      <ambientLight intensity={0.03} />
      <Light position={[0, 5, 0]} />
      <TextureProvider>{storyfn()}</TextureProvider>
      <axesHelper args={[10]} />
    </Canvas>
  )
}
