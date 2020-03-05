import React, { useRef } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import * as THREE from 'three'

extend({ TrackballControls })

const ALT_KEY = 18
const CTRL_KEY = 17
const CMD_KEY = 91

export default () => {
  const controls = useRef<any>()
  const { camera, gl } = useThree()

  useFrame(() => {
    controls.current.update()
  })

  return (
    //@ts-ignore
    <trackballControls
      ref={controls}
      args={[camera, gl.domElement]}
      dynamicDampingFactor={0.1}
      keys={[ALT_KEY, CTRL_KEY, CMD_KEY]}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
    />
  )
}
