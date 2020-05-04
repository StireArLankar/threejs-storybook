import React, { useRef, memo, useEffect, useCallback } from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { TextureProvider } from './TextureProvider'
import * as Tiles from './Tiles'
//@ts-ignore
import { useSpring } from 'react-spring/three'
import { addV, subV, vector } from '../../utils'

interface Props {}

const Light = ({ position }: any) => {
  const mesh = new THREE.PointLight(0xffffff)

  return (
    <group>
      <primitive object={mesh} position={position} intensity={0.7} />
      <pointLightHelper args={[mesh, 10, 'white']} />
    </group>
  )
}

const getTarget = (camera: THREE.Camera) => {
  var vector = new THREE.Vector3(0, 0, -1)
  vector.applyQuaternion(camera.quaternion)

  return vector
}

const getV = (v: THREE.Vector3) => Object.values(v) as vector

const Controls = memo((props: Props) => {
  const { camera, mouse } = useThree()

  const target = useRef(getV(getTarget(camera)))
  const direction = useRef<vector>([1, 0, 0])
  const targetBase = useRef(getV(getTarget(camera)))

  const moving = useRef(false)

  const [, set] = useSpring(() => ({
    from: {
      position: Object.values(camera.position),
      target: target.current,
    },
    config: { clamp: true, mass: 5 },
    onFrame: ({ position, target }: Record<string, vector>) => {
      camera.position.set(...position)
      camera.lookAt(...target)
    },
    onRest: () => {
      moving.current = false
    },
  }))

  const moveCamera = useCallback(
    (forward?: boolean) => {
      if (moving.current) {
        return
      }

      const sign = forward ? 1 : -1

      const v = direction.current.map((x) => (x !== 0 ? x * 10 * sign : 0)) as vector

      const newTarget = addV(targetBase.current, v)

      const z = direction.current[0] * mouse.x
      const x = -direction.current[2] * mouse.x
      const y = mouse.y

      targetBase.current = newTarget
      target.current = addV(targetBase.current, [x, y, z])

      const oldPosition = getV(camera.position)
      const newPosition = addV(oldPosition, v)

      moving.current = true

      set({ to: { position: newPosition, target: target.current } })
    },
    [set, camera, mouse]
  )

  const rotateCamera = useCallback(
    (left?: boolean) => {
      if (moving.current) {
        return
      }

      const angle = left ? 1 : -1

      const newDirection: vector = [direction.current[2] * angle, 0, direction.current[0] * -angle]
      const v = newDirection.map((x) => x * 10) as vector

      direction.current = newDirection

      const oldPosition = getV(camera.position)
      const newTarget = addV(oldPosition, v)

      const z = direction.current[0] * mouse.x
      const x = -direction.current[2] * mouse.x
      const y = mouse.y

      targetBase.current = newTarget
      target.current = addV(targetBase.current, [x, y, z])

      moving.current = true

      set({ to: { target: target.current } })
    },
    [set, camera, mouse]
  )

  useFrame(({ mouse }) => {
    if (moving.current) {
      return
    }

    const z = direction.current[0] * mouse.x
    const x = -direction.current[2] * mouse.x
    const y = mouse.y

    target.current = addV(targetBase.current, [x, y, z])

    set({ to: { target: target.current } })
  })

  useEffect(() => {
    const handler = (evt: KeyboardEvent) => {
      if (evt.keyCode === 38) {
        moveCamera(true)
      }

      if (evt.keyCode === 40) {
        moveCamera(false)
      }

      if (evt.keyCode === 37) {
        rotateCamera(true)
      }

      if (evt.keyCode === 39) {
        rotateCamera()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [moveCamera, rotateCamera])

  return null
})

export default Controls

export const Example = () => {
  return (
    <Canvas camera={{ position: [-10, 0, 0] }} shadowMap>
      <Controls />
      <ambientLight intensity={0.03} />
      <Light position={[0, 0, 0]} />
      <TextureProvider>
        <Tiles.Tile2Ways />
        <Tiles.Tile2Ways position-x={10} />
        <Tiles.Tile3Ways position-x={20} />
        <Tiles.Tile1Ways position-x={20} position-z={-10} rotation-y={Math.PI * 0.5} />
        <Tiles.Tile1Ways position-x={30} />
      </TextureProvider>
      <axesHelper args={[10]} />
    </Canvas>
  )
}
