import React, { useState, useRef } from 'react'
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//@ts-ignore
import { useSpring, a } from 'react-spring/three'
import { Effects } from './Effects'

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
    >
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      <a.meshBasicMaterial attach='material' color={color} />
    </a.mesh>
  )
}

export default () => {
  return (
    <Canvas>
      <Controls />
      {/* <ambientLight /> */}
      {/* <pointLight position={[10, 10, 10]} /> */}
      <Box />
      <Effects />
    </Canvas>
  )
}
