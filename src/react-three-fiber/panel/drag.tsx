import React, { memo } from 'react'
//@ts-ignore
import { a, useSpring } from 'react-spring/three'
import { Canvas, useUpdate } from 'react-three-fiber'
import { useDrag } from 'react-use-gesture'
import * as THREE from 'three'

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

const Panels = (props: any) => {
  const { position = [0, 0, 0] } = props

  const [{ rotation }, set] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 3, friction: 40, tension: 800 },
  }))

  const bind = useDrag(
    ({ offset: [x], down, ...props }) => {
      set({ rotation: [0, x / 300, 0] })
    },
    { eventOptions: { pointer: true } }
  )

  return (
    <a.group position={position} rotation={rotation} {...bind()}>
      <Panel position={[0, 0, 10]} rotation={[0, Math.PI, 0]} />
      <Panel position={[8.7, 0, -5]} rotation={[0, Math.PI + (Math.PI * 2) / 3, 0]} />
      <Panel position={[-8.7, 0, -5]} rotation={[0, Math.PI + (Math.PI * 2 * 2) / 3, 0]} />
    </a.group>
  )
}

export default () => {
  return (
    <Canvas camera={{ position: [0, 0, 0] }}>
      <ambientLight intensity={0.3} />
      <Light position={[0, 10, 10]} />
      <Panels position={[0, 0, -30]} />
    </Canvas>
  )
}
