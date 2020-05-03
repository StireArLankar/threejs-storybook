import React, { memo, useContext } from 'react'
import { TextureContext } from './TextureProvider'
import { ReactThreeFiber } from 'react-three-fiber'
import * as THREE from 'three'

type Props = ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>

export default memo((props: Props) => {
  const texture = useContext(TextureContext).ceiling

  return (
    <mesh receiveShadow position-y={5} rotation-x={Math.PI * -0.5} {...props}>
      <meshPhongMaterial attach='material' map={texture} side={THREE.DoubleSide} />
      <planeGeometry attach='geometry' args={[10, 10]} />
    </mesh>
  )
})
