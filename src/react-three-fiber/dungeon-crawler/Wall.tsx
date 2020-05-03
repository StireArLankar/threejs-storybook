import React, { memo, useContext } from 'react'
import { TextureContext } from './TextureProvider'
import { ReactThreeFiber, useUpdate } from 'react-three-fiber'
import * as THREE from 'three'

type Props = ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>

export default memo((props: Props) => {
  const texture = useContext(TextureContext).wall

  const geo = useUpdate((geometry: any) => {
    geometry.center()
  }, [])

  return (
    <mesh receiveShadow {...props}>
      <meshPhongMaterial attach='material' map={texture} side={THREE.DoubleSide} />
      <planeGeometry attach='geometry' args={[10, 10]} ref={geo} />
    </mesh>
  )
})
