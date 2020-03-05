import React from 'react'
import { Canvas } from 'react-three-fiber'
import Controls from './TrackballControls'

export default () => {
  return (
    <Canvas style={{ background: '#000000' }}>
      <Controls />
      <ambientLight color={'#ffffff' as any} intensity={0.1} />
      <hemisphereLight
        color={'#ffffff' as any}
        skyColor={'#ffffbb' as any}
        groundColor={'#080820' as any}
        intensity={1.0}
      />
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderBufferGeometry attach='geometry' args={[0.5, 0.5, 0.15, 32]} />
        <meshStandardMaterial attach='material' color='#fff' />
      </mesh>
    </Canvas>
  )
}
