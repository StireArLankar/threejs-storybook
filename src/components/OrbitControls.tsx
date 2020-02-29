import React, { useEffect, useRef } from 'react'
//@ts-ignore
import { useSpring } from 'react-spring/three'
import { extend, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { addV, subV, vector } from '../utils'

extend({ OrbitControls })

export interface OrbitControlsProps {
  target: vector
  position?: vector
}

export default (props: OrbitControlsProps) => {
  const { target, position } = props
  const ref = useRef<any>()
  const { camera, gl } = useThree()

  const [anim, set] = useSpring(() => ({
    from: {
      position: Object.values(camera.position),
      target: target,
    },
    config: { clamp: true, mass: 5 },
    onStart: () => {
      if (ref.current) {
        ref.current.enabled = false
      }
    },
    onRest: () => {
      ref.current.enabled = true
    },
    onFrame: ({ position, target }: any) => {
      ref.current.object.position.set(...position)
      ref.current.target = new THREE.Vector3(...target)
      ref.current.update()
    },
  }))

  const oldPosition = Object.values(camera.position) as vector
  let newPosition: vector

  if (position) {
    newPosition = position
  } else {
    const oldTarget = anim.target.getValue() as vector
    const newTarget = target
    newPosition = addV(subV(newTarget, oldTarget), oldPosition)
  }

  useEffect(() => {
    set({
      to: [
        { position: oldPosition, immediate: true },
        { position: newPosition, immediate: false, target },
      ],
    })
  }, [target, set, oldPosition, newPosition])

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
