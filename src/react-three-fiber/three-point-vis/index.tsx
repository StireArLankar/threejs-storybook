import React from 'react'
import { Canvas } from 'react-three-fiber'
import Controls from './TrackballControls'

const data = new Array(1000).fill(0).map((_, id) => ({ id }))

export default () => {
  const renderPoints = () =>
    data.map((item, i) => {
      const x = (i % 30) * 1.05
      const y = Math.floor(i / 30) * 1.05
      const z = 0
      return (
        <mesh key={item.id} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderBufferGeometry attach='geometry' args={[0.5, 0.5, 0.15, 32]} />
          <meshStandardMaterial attach='material' color='#fff' />
        </mesh>
      )
    })

  return (
    <Canvas style={{ background: '#000000' }} camera={{ position: [0, 0, 40] }}>
      <Controls />
      <ambientLight color={'#ffffff' as any} intensity={0.1} />
      <hemisphereLight
        color={'#ffffff' as any}
        skyColor={'#ffffbb' as any}
        groundColor={'#080820' as any}
        intensity={1.0}
      />
      {renderPoints()}

      {/* <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderBufferGeometry attach='geometry' args={[0.5, 0.5, 0.15, 32]} />
        <meshStandardMaterial attach='material' color='#fff' />
      </mesh> */}
    </Canvas>
  )
}
