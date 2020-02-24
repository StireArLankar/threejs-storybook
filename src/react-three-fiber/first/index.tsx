import React, { useState, useRef } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
//@ts-ignore
import { useSpring, a } from 'react-spring/three'

const Box = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [active, setActive] = useState(false)

  const { scale, color } = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: isHovered ? 'hotpink' : 'grey',
  })

  const ref = useRef<any>()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <a.mesh
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => setActive((prev) => !prev)}
      scale={scale}
      ref={ref}
    >
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      <a.meshBasicMaterial attach='material' color={color} />
    </a.mesh>
  )
}

export default () => {
  return (
    <Canvas>
      {/* <ambientLight />
      <pointLight position={[10, 10, 10]} /> */}
      <Box />
    </Canvas>
  )
}
