import * as THREE from 'three'
import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useLoader, useFrame, useUpdate } from 'react-three-fiber'

const Text = ({
  children,
  vAlign = 'center',
  hAlign = 'center',
  size = 1,
  color = '#000000',
  ...props
}: any) => {
  const font = useLoader(THREE.FontLoader, process.env.PUBLIC_URL + '/assets/bold.blob')

  const config = useMemo(
    () => ({
      font,
      size: 40,
      height: 30,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 6,
      bevelSize: 2.5,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    [font]
  )

  const mesh = useUpdate<any>(
    (self) => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(size)
      self.position.x = hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x
      self.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
    },
    [children]
  )

  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry attach='geometry' args={[children, config]} />
        <meshNormalMaterial attach='material' />
      </mesh>
    </group>
  )
}

const Jumbo = () => {
  const ref = useRef<any>()

  useFrame(({ clock }) => {
    const { rotation } = ref.current
    const value = Math.sin(clock.getElapsedTime()) * 0.3
    rotation.x = rotation.y = rotation.z = value
  })

  return (
    <group ref={ref}>
      <Text hAlign='left' position={[0, 4.2, 0]} children='TAKEN' />
      <Text hAlign='left' position={[0, 0, 0]} children='FROM' />
      <Text hAlign='left' position={[0, -4.2, 0]} children='DOCS' />
      <Text hAlign='left' position={[12, 0, 0]} children='4' size={3} />
      <Text hAlign='left' position={[16.5, -4.2, 0]} children='X' />
    </group>
  )
}

export default () => {
  return (
    <Canvas camera={{ position: [0, 0, 35] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <Suspense fallback={null}>
        <Jumbo />
      </Suspense>
    </Canvas>
  )
}
