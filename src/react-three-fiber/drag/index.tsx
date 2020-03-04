import React from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import { useDrag, useHover } from 'react-use-gesture'
//@ts-ignore
import { useSpring, a } from 'react-spring/three'

function Dodecahedron() {
  const { size, viewport } = useThree()

  const aspect = size.width / viewport.width

  console.log(aspect, size, viewport)

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 3, friction: 40, tension: 800 },
  }))

  const bindDrag = useDrag(
    ({ offset: [x, y], vxvy: [vx, vy], down, ...props }) => {
      if (props.tap) {
        console.log(props.tap)
      }

      set({
        position: [x / aspect, -y / aspect, 0],
        rotation: [y / aspect, x / aspect, 0],
      })
    },
    { eventOptions: { pointer: true } }
  )

  const bindHover = useHover(
    ({ hovering }) => set({ scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1] }),
    { eventOptions: { pointer: true } }
  )

  return (
    <a.mesh {...spring} {...bindDrag()} {...bindHover()} castShadow>
      <dodecahedronBufferGeometry attach='geometry' args={[1, 1]} />
      <meshNormalMaterial attach='material' wireframe />
    </a.mesh>
  )
}

export default () => {
  return (
    <Canvas style={{ background: 'lightblue' }} shadowMap camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.6}
        position={[20, 10, 10]}
        angle={0.2}
        penumbra={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />
      <gridHelper args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.1]} />
      <group position={[0.5, 0, 0.1]}>
        <mesh>
          <planeBufferGeometry attach='geometry' args={[1, 15]} />
          <meshPhongMaterial attach='material' color='red' />
        </mesh>
      </group>
      <group position={[-0.5, 0.5, 0.1]}>
        <mesh>
          <planeBufferGeometry attach='geometry' args={[1, 1]} />
          <meshPhongMaterial attach='material' color='green' />
        </mesh>
      </group>
      <mesh receiveShadow>
        <planeBufferGeometry attach='geometry' args={[1000, 1000]} />
        <meshPhongMaterial attach='material' color='#272727' />
      </mesh>
      <Dodecahedron />
    </Canvas>
  )
}
