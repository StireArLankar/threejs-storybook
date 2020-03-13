import React, { useRef } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { Tube } from './Tube'

const background = `#${new THREE.Color().setHSL(Math.random(), 0.1, 0.3).getHexString()}`

const Controls = () => {
  const { camera, gl } = useThree()
  const ref = useRef<any>()

  useFrame(() => {
    ref.current.update()
  })

  return (
    //@ts-ignore
    <orbitControls
      autoRotate
      enableDamping
      dampingFactor={0.2}
      args={[camera, gl.domElement]}
      ref={ref}
    />
  )
}

const arr = Array.from({ length: 50 }, (_, k) => k)

export default () => {
  const renderTubes = () => arr.map((k) => <Tube key={k} index={k} />)

  return (
    <Canvas camera={{ position: [0, 0, 60], fov: 40 }} shadowMap style={{ background }}>
      <Controls />
      <mesh receiveShadow position-y={-15} rotation-x={Math.PI * -0.5}>
        <planeGeometry attach='geometry' args={[1000, 1000]} />
        <meshPhongMaterial attach='material' emissive={background as any} />
      </mesh>
      <spotLight
        args={['#ffffff', 2, 80, Math.PI * 0.25, 1, 2]}
        position={[0, 40, 0]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={31}
      />
      {renderTubes()}
      //@ts-ignore
      <fog attach='fog' args={[background, 0.0025, 300]} />
    </Canvas>
  )
}
