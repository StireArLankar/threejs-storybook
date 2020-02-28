import React, { useCallback, useEffect, useRef } from 'react'
//@ts-ignore
import { useSpring } from 'react-spring/three'
import { extend, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { addV, getPos, subV, vector } from '../utils'

extend({ OrbitControls })

export const useOrbitControls = (active: vector, initialPosition: vector = [0, 0, 0]) => {
  const ref = useRef<any>()

  useFrame(() => {
    if (!ref.current.enabled) {
      ref.current.object.position.set(...anim2.xyz.getValue())
      ref.current.target = new THREE.Vector3(...anim.xyz.getValue())

      ref.current.update()
    }
  })

  const [anim, set] = useSpring(() => ({
    xyz: active,
    config: { clamp: true, mass: 5 },
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

  const oldPos = anim.xyz.getValue() as vector
  const oldCameraPos = getPos(ref) || initialPosition
  const newPos = [active[0], 0.5, active[2]] as vector
  const newCameraPos = addV(subV(newPos, oldPos), oldCameraPos)

  const anim2 = useSpring({
    config: { clamp: true, mass: 5 },
    from: { xyz: oldCameraPos },
    to: [
      { xyz: oldCameraPos, immediate: true },
      { xyz: newCameraPos, immediate: false },
    ],
  })

  const { camera, gl } = useThree()

  return useCallback(
    () => (
      //@ts-ignore
      <orbitControls
        args={[camera, gl.domElement]}
        maxPolarAngle={(Math.PI * 35) / 80}
        minPolarAngle={0}
        ref={ref}
      />
    ),
    [camera, gl]
  )
}
