import React, { memo } from 'react'
import { ReactThreeFiber } from 'react-three-fiber'
import * as THREE from 'three'
import Ceiling from './Ceiling'
import Floor from './Floor'
import Wall from './Wall'

type Props = ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>

export const Tile1Ways = memo((props: Props) => {
  return (
    <group {...props}>
      <Floor />
      <Ceiling />
      <Wall position-x={5} rotation-y={Math.PI * 0.5} />
      <Wall position-z={-5} />
      <Wall position-z={5} />
    </group>
  )
})

export const Tile2Ways = memo((props: Props) => {
  return (
    <group {...props}>
      <Floor />
      <Ceiling />
      <Wall position-z={-5} />
      <Wall position-z={5} />
    </group>
  )
})

export const Tile3Ways = memo((props: Props) => {
  return (
    <group {...props}>
      <Floor />
      <Ceiling />
      <Wall position-z={5} />
    </group>
  )
})

export const Tile4Ways = memo((props: Props) => {
  return (
    <group {...props}>
      <Floor />
      <Ceiling />
    </group>
  )
})
