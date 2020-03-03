import React, { memo, useRef } from 'react'
import { Canvas, useFrame, useThree, useUpdate } from 'react-three-fiber'
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
  const { position = [0, 0, 0], rotation = [0, 0, 0] } = props

  return (
    <group position={position} rotation={rotation}>
      <axesHelper args={[50]} />
      <Panel position={[0, 0, 10]} rotation={[0, Math.PI, 0]} />
      <Panel position={[8.7, 0, -5]} rotation={[0, Math.PI + (Math.PI * 2) / 3, 0]} />
      <Panel position={[-8.7, 0, -5]} rotation={[0, Math.PI + (Math.PI * 2 * 2) / 3, 0]} />
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
  const renderPanels = (length: number) =>
    Array.from({ length }, (_, k) => {
      const angle = (Math.PI * 2 * k) / length

      return (
        <Panels
          key={k}
          position={[50 * Math.sin(angle), 0, -50 * Math.cos(angle)]}
          rotation={[0, -angle, 0]}
        />
      )
    })

  return (
    <Canvas camera={{ position: [0, 70, 0] }}>
      <Controls />
      <ambientLight intensity={0.3} />
      <Light position={[0, 10, 10]} />

      {renderPanels(5)}
    </Canvas>
  )
}
