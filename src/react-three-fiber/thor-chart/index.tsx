import React, { useState, useRef, memo, useContext, useMemo, useEffect } from 'react'
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//@ts-ignore
import { useSpring, a } from 'react-spring/three'
import * as THREE from 'three'

import { Thor } from './Thor'

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
    xyz: [active[0], 0.5, active[2]],
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
    set({ xyz: [active[0], 0.5, active[2]] })
  }, [active, set])

  const oldCameraPos = getPos(ref)

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
        xyz: [active[0], 5, 0],
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

export default () => {
  const [active, setActive] = useState<vector>([0, 0, 0])

  return (
    <Canvas camera={{ position: [0, 5, 0] }}>
      <CtrContext.Provider value={{ active, setActive }}>
        <Controls />
        <ambientLight />
        <spotLight position={[0, 5, 0]} intensity={0.5} />
        <Thor position={[0, 0, 0]} arc={100} index={0} amount={4} />
        <Thor position={[0, 0, 0]} arc={75} index={1} amount={4} />
        <Thor position={[0, 0, 0]} arc={50} index={2} amount={4} />
        <Thor position={[0, 0, 0]} arc={25} index={3} amount={4} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeBufferGeometry attach='geometry' args={[100, 100]} />
          <meshPhysicalMaterial attach='material' color='rgba(100,150, 100, 0.5)' />
        </mesh>
      </CtrContext.Provider>
    </Canvas>
  )
}
