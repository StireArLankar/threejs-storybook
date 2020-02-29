import React, { memo, useContext, useMemo, useRef, useState } from 'react'
//@ts-ignore
import { a, useSpring } from 'react-spring/three'
import { Canvas } from 'react-three-fiber'
import OrbitControls from '../../components/OrbitControls'

import { arrayComparator, vector } from '../../utils'

interface CtxModel {
  active: vector
  setActive: React.Dispatch<React.SetStateAction<vector>>
}

const CtrContext = React.createContext<CtxModel>({
  active: [0, 0, 0],
  setActive: () => {},
})

interface BoxProps {
  position: vector
  size: vector
}

const Box = memo((props: BoxProps) => {
  const { position, size } = props

  const { setActive } = useContext(CtrContext)

  const pos = useMemo<vector>(() => [position[0], size[1] / 2, position[2]], [position, size])

  const pointerRef = useRef(false)

  const onClick = (evt: any) => {
    evt.stopPropagation()
    if (pointerRef.current) {
      pointerRef.current = false
      setActive((prev) => (arrayComparator(prev, pos) ? prev : pos))
    }
  }

  const { scale, color } = useSpring({
    scale: [1, 1, 1],
    color: 'grey',
  })

  const onPointerOver = (evt: any) => {
    evt.stopPropagation()
  }

  const onPointerOut = (evt: any) => {
    evt.stopPropagation()
    pointerRef.current = false
  }

  return (
    <a.mesh
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerUp={onClick}
      onPointerDown={() => (pointerRef.current = true)}
      scale={scale}
      position={pos}
      castShadow
    >
      <boxBufferGeometry attach='geometry' args={size} />
      <a.meshLambertMaterial attach='material' color={color} />
    </a.mesh>
  )
})

export default () => {
  const [active, setActive] = useState<vector>([0, 0, 0])

  return (
    <Canvas camera={{ position: [0, 2, 5] }} shadowMap>
      <CtrContext.Provider value={{ active, setActive }}>
        <OrbitControls target={active} position={[active[0], 2, 5]} />
        <ambientLight />
        <spotLight position={[0, 5, 5]} intensity={0.5} castShadow />
        <Box position={[-4, 0, 0]} size={[1, 1, 1]} />
        <Box position={[0, 0, 0]} size={[1, 1, 1]} />
        <Box position={[4, 0, 0]} size={[1, 1, 1]} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeBufferGeometry attach='geometry' args={[100, 100]} />
          <meshPhysicalMaterial attach='material' color='rgba(100,150, 100, 0.5)' />
        </mesh>
      </CtrContext.Provider>
    </Canvas>
  )
}
