import React, { useState, useRef, useContext, useEffect } from 'react'
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//@ts-ignore
import { useSpring } from 'react-spring/three'
import * as THREE from 'three'

import { ThorsGroup } from './ThorsGroup'

extend({ OrbitControls })

export const getPos = (ref: any): vector =>
  (ref.current ? Object.values(ref.current?.object.position) : [0, 5, 0]) as vector

export const arrayComparator = (a: any[], b: any) => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

export type vector = [number, number, number]

export interface CtxModel {
  active: vector
  setActive: React.Dispatch<React.SetStateAction<vector>>
}

export const CtrContext = React.createContext<CtxModel>({
  active: [0, 0, 0],
  setActive: () => {},
})

const subV = (a: vector, b: vector): vector => a.map((ai, i) => ai - b[i]) as vector
const addV = (a: vector, b: vector): vector => a.map((ai, i) => ai + b[i]) as vector

const Controls = () => {
  const { camera, gl } = useThree()
  const ref = useRef<any>()

  useFrame(() => {
    if (!ref.current.enabled) {
      ref.current.object.position.set(...anim2.xyz.getValue())
      ref.current.target = new THREE.Vector3(...anim.xyz.getValue())

      ref.current.update()
    }
  })

  const { active } = useContext(CtrContext)

  const [anim, set] = useSpring(() => ({
    xyz: [0, 0, 0],
    config: {
      clamp: true,
      mass: 5,
    },
    onStart: () => {
      if (ref.current) {
        ref.current.enabled = false
      }
    },
    onRest: () => {
      ref.current.enabled = true
    },
  }))

  useEffect(() => {
    set({ xyz: [active[0], 0, active[2]] })
  }, [active, set])

  const oldPos = anim.xyz.getValue() as vector
  const oldCameraPos = getPos(ref)
  const newPos = [active[0], 0, active[2]] as vector
  const newCameraPos = addV(subV(newPos, oldPos), oldCameraPos)

  const anim2 = useSpring({
    config: {
      clamp: true,
      mass: 5,
    },
    from: {
      xyz: oldCameraPos,
    },
    to: [
      {
        xyz: oldCameraPos,
        immediate: true,
      },
      {
        xyz: newCameraPos,
        immediate: false,
      },
    ],
  })

  return (
    //@ts-ignore
    <orbitControls
      args={[camera, gl.domElement]}
      maxPolarAngle={(Math.PI * 35) / 80}
      minPolarAngle={0}
      ref={ref}
    />
  )
}

const positions: vector[] = [
  [0, 0, 0],
  [10, 0, 0],
  [-10, 0, 0],
  [0, 0, 10],
  [0, 0, -10],
  [-10, 0, -10],
  [10, 0, -10],
  [-10, 0, 10],
  [10, 0, 10],
]

const data = positions.map(() =>
  Array.from({ length: Math.random() * 5 + 2 }, (_, k) =>
    k === 0 ? 100 : Math.random() * 100
  ).sort((a, b) => b - a)
)

export default () => {
  const [active, setActive] = useState<vector>(positions[0])

  return (
    <Canvas camera={{ position: [0, 10, 1] }} shadowMap>
      <CtrContext.Provider value={{ active, setActive }}>
        <Controls />
        <ambientLight />

        {positions.map((pos, index) => (
          <ThorsGroup key={index} position={pos} data={data[index]} />
        ))}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeBufferGeometry attach='geometry' args={[100, 100]} />
          <meshPhysicalMaterial attach='material' color='rgba(100,150, 100, 0.5)' />
        </mesh>
      </CtrContext.Provider>
    </Canvas>
  )
}
