import React, { memo, useState } from 'react'
import { Canvas, useUpdate } from 'react-three-fiber'
import * as THREE from 'three'
import OrbitControls from '../../components/OrbitControls'
import { vector } from '../../utils'

const Light = ({ position }: any) => {
  const mesh = new THREE.DirectionalLight(0xffffff)

  return (
    <group>
      <primitive object={mesh} position={position} intensity={0.3} />
      <directionalLightHelper args={[mesh, 10, 'white'] as any} />
    </group>
  )
}

const Panel = memo((props: any) => {
  const length = 10
  const width = 5

  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(0, width)
  shape.lineTo(length, width)
  shape.lineTo(length, 0)
  shape.lineTo(0, 0)

  const extrudeSettings = {
    steps: 1,
    depth: 1,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 3,
    bevelOffset: 2,
    bevelSegments: 20,
  }

  const ref = useUpdate((geometry: any) => {
    geometry.center()
  }, [])

  return (
    <mesh>
      <extrudeBufferGeometry ref={ref} attach='geometry' args={[shape, extrudeSettings]} />
      <meshPhongMaterial attach='material' color='red' />
    </mesh>
  )
})

export default () => {
  const [active] = useState<vector>([0, 0, 0])

  return (
    <Canvas camera={{ position: [0, 5, 20] }} shadowMap>
      <OrbitControls target={active} />
      <ambientLight intensity={0.3} />
      <Light position={[0, 10, 10]} />
      {/* <directionalLight position={[10, 10, 10]} /> */}
      <Panel />
    </Canvas>
  )
}
