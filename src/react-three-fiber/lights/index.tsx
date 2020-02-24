//@ts-nocheck
import React, { useState, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//@ts-ignore
import { useSpring, a } from 'react-spring/three'

extend({ OrbitControls })

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
      maxPolarAngle={Math.PI / 3}
      minPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
      ref={ref}
    />
  )
}

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry attach='geometry' args={[100, 100]} />
    <meshPhysicalMaterial attach='material' color='white' />
  </mesh>
)

const Box = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [active, setActive] = useState(false)

  const { scale, color } = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: isHovered ? 'hotpink' : 'grey',
  })

  return (
    <a.mesh
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => setActive((prev) => !prev)}
      scale={scale}
      castShadow
    >
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      <a.meshPhysicalMaterial attach='material' color={color} />
    </a.mesh>
  )
}

export default () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8] }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <Controls />
      <fog attach='fog' args={['white', 5, 15]} />
      {/* <ambientLight intensity={0.5} /> */}
      <spotLight position={[0, 3, 10]} penumbra={1} castShadow />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <Box />
      <Plane />
    </Canvas>
  )
}
