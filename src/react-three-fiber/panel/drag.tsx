import React, { Suspense, memo, useState, useEffect, Fragment, useContext } from 'react'
//@ts-ignore
import { a, useSpring } from 'react-spring/three'
import { Canvas, useUpdate, useLoader } from 'react-three-fiber'
import { useDrag } from 'react-use-gesture'
import * as THREE from 'three'

const ctx = React.createContext<THREE.Texture>(null as any)

const Panel = memo((props: any) => {
  const length = 19
  const width = 10

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

  const nepu = useContext(ctx)

  return (
    <group {...props}>
      <mesh>
        <extrudeBufferGeometry ref={ref} attach='geometry' args={[shape, extrudeSettings]} />
        {/* <meshPhysicalMaterial
          attach='material'
          color='#4c71ac'
          metalness={0.5}
          reflectivity={3.0}
          roughness={10}
        /> */}
        <meshPhongMaterial attach='material' color='#4c71ac' shininess={50} />
      </mesh>
      <Suspense fallback={null}>
        <mesh position={[0, 0, 1.3]}>
          <meshPhongMaterial attach='material' map={nepu} shininess={100} />
          <planeBufferGeometry attach='geometry' args={[19, 10, 1]} />
        </mesh>
      </Suspense>
    </group>
  )
})

const updateCurrentIndex = (x: number, width: number) => {
  const offset = x % width

  const diff = (x - offset) / width

  if (offset > width / 2) {
    return diff + 1
  } else if (offset < -width / 2) {
    return diff - 1
  }

  return diff
}

const deg120 = (Math.PI * 2) / 3

const PanelsRaw = () => (
  <Fragment>
    <Panel position={[0, 0, 10]} rotation={[0, 0, 0]} />
    <Panel position={[8.7, 0, -5]} rotation={[0, deg120, 0]} />
    <Panel position={[-8.7, 0, -5]} rotation={[0, deg120 * 2, 0]} />
  </Fragment>
)

const Panels = (props: any) => {
  const { position = [0, 0, 0] } = props

  const [selected, setSelected] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const [{ rotation }, set] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 3, friction: 40, tension: 600 },
  }))

  useEffect(() => {
    set({ rotation: [0, selected * deg120, 0] })
  }, [selected, set, isDragging])

  const bind = useDrag(
    ({ movement: [x], down }) => {
      if (down) {
        setIsDragging(true)
        set({ rotation: [0, x / (Math.PI * 100), 0] })
      } else {
        setIsDragging(false)
        setSelected(updateCurrentIndex(x / (Math.PI * 100), deg120))
      }
    },
    { eventOptions: { pointer: true }, initial: () => [rotation.getValue()[1] * Math.PI * 100, 0] }
  )

  return (
    <a.group position={position} rotation={rotation} {...bind()}>
      <PanelsRaw />
    </a.group>
  )
}

export default () => {
  const nepu = useLoader(THREE.TextureLoader, process.env.PUBLIC_URL + '/assets/nepuuu.png')

  return (
    <Canvas camera={{ position: [0, 0, 0] }}>
      <ctx.Provider value={nepu}>
        <spotLight position={[0, 5, 10]} distance={90} intensity={1.2} decay={2} />
        <Panels position={[0, 0, -30]} />
      </ctx.Provider>
    </Canvas>
  )
}
