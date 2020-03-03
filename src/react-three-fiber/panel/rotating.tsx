import React, { memo, useState, useRef } from 'react'
import { Canvas, useUpdate, useThree, useFrame } from 'react-three-fiber'
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
  const length = 14
  const width = 9

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
    bevelThickness: 0.7,
    bevelSize: 3,
    bevelOffset: 0,
    bevelSegments: 20,
  }

  const ref = useUpdate((geometry: any) => {
    geometry.center()
  }, [])

  return (
    <mesh {...props}>
      <extrudeBufferGeometry ref={ref} attach='geometry' args={[shape, extrudeSettings]} />
      <meshPhongMaterial attach='material' color='red' />
      <axesHelper args={[10]} />
    </mesh>
  )
})

const Panels = () => {
  return (
    <group position={[0, 0, 10]}>
      <gridHelper args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.3]} />
      <Panel position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
      <Panel position={[8.7, 0, -15]} rotation={[0, Math.PI + (Math.PI * 2) / 3, 0]} />
      <Panel position={[-8.7, 0, -15]} rotation={[0, Math.PI + (Math.PI * 2 * 2) / 3, 0]} />
    </group>
  )
}

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

export default () => {
  return (
    <Canvas camera={{ position: [0, 5, 30] }}>
      <Controls />
      <ambientLight intensity={0.3} />
      <Light position={[0, 10, 10]} />
      <Panels />
    </Canvas>
  )
}
