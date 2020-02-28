import React, { Fragment, memo, useContext, useMemo, useState, useCallback } from 'react'
//@ts-ignore
import { a, useSpring } from 'react-spring/three'
import { Canvas } from 'react-three-fiber'
import { useOrbitControls } from '../../hooks/useOrbitControls'
import { arrayComparator, vector } from '../../utils'
import { useOnClick } from '../../hooks/useOnClick'

interface StateContextModel {
  active: vector
}
interface DispatchContextModel {
  setActive: React.Dispatch<React.SetStateAction<vector>>
}

const StateContext = React.createContext<StateContextModel>({
  active: [0, 0, 0],
})

const DispatchContext = React.createContext<DispatchContextModel>({
  setActive: () => {},
})

interface BoxProps {
  position: vector
  size: vector
}

const Box = memo((props: BoxProps) => {
  const { position, size } = props

  const { setActive } = useContext(DispatchContext)

  const pos = useMemo<vector>(() => [position[0], size[1] / 2, position[2]], [position, size])

  const action = useCallback(() => {
    setActive((prev) => (arrayComparator(prev, pos) ? prev : pos))
  }, [setActive, pos])

  const actions = useOnClick(action)

  const { scale, color } = useSpring({
    scale: [1, 1, 1],
    color: 'grey',
  })

  return (
    <a.mesh {...actions} scale={scale} position={pos} castShadow>
      <boxBufferGeometry attach='geometry' args={size} />
      <a.meshLambertMaterial attach='material' color={color} />
    </a.mesh>
  )
})

const INITIAL_CAMERA_POSITION: vector = [0, 2, 5]

const boxPositions: vector[] = [
  [-4, 0, 0],
  [0, 0, 0],
  [4, 0, 0],
]

const BOX_SIZE: vector = [1, 1, 1]

const Inner = memo(({ active }: { active: vector }) => {
  const OrbitControls = useOrbitControls(active, INITIAL_CAMERA_POSITION)

  return (
    <Fragment>
      <OrbitControls />
      <ambientLight />
      <spotLight position={[0, 5, 5]} intensity={0.5} castShadow />

      <Box position={boxPositions[0]} size={BOX_SIZE} />
      <Box position={boxPositions[1]} size={BOX_SIZE} />
      <Box position={boxPositions[2]} size={BOX_SIZE} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeBufferGeometry attach='geometry' args={[100, 100]} />
        <meshPhysicalMaterial attach='material' color='rgba(100, 150, 100)' />
      </mesh>
    </Fragment>
  )
})

export default () => {
  const [active, setActive] = useState<vector>([0, 0, 0])

  const dispatch = useMemo(() => ({ setActive }), [])

  return (
    <Fragment>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 10,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
        }}
      >
        <button onClick={() => setActive([-4, 0.5, 0])}>Focus first</button>
        <button onClick={() => setActive([0, 0.5, 0])}>Focus second</button>
        <button onClick={() => setActive([4, 0.5, 0])}>Focus third</button>
      </div>
      <Canvas camera={{ position: INITIAL_CAMERA_POSITION }} shadowMap>
        <DispatchContext.Provider value={dispatch}>
          <StateContext.Provider value={{ active }}>
            <Inner active={active} />
          </StateContext.Provider>
        </DispatchContext.Provider>
      </Canvas>
    </Fragment>
  )
}
