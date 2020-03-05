import React, { useMemo, useRef, Suspense } from 'react'
import { Canvas, useThree, useFrame, useUpdate, useLoader } from 'react-three-fiber'
import * as THREE from 'three'

const Arrow = () => {
  const points = useMemo(() => {
    var points = []

    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(1, 0))
    points.push(new THREE.Vector2(1, 5))
    points.push(new THREE.Vector2(2, 5))
    points.push(new THREE.Vector2(0, 7))

    return points
  }, [])

  const geo = useUpdate((geometry: any) => {
    geometry.center()
  }, [])

  const brick = useLoader(THREE.TextureLoader, process.env.PUBLIC_URL + '/assets/brick.jpg')

  return (
    <mesh scale={[1.5, 1, 1]}>
      <latheGeometry attach='geometry' args={[points, 50]} ref={geo} />
      <meshPhongMaterial
        attach='material'
        color='red'
        shininess={100}
        side={THREE.DoubleSide}
        map={brick}
      />
    </mesh>
  )
}

const Controls = () => {
  const { camera, gl } = useThree()
  const ref = useRef<any>()

  useFrame(() => {
    ref.current.update()
  })

  return (
    //@ts-ignore
    <orbitControls args={[camera, gl.domElement]} ref={ref} />
  )
}

export default () => {
  return (
    <Canvas style={{ background: 'lightblue' }} camera={{ position: [0, 0, 10] }}>
      <Controls />
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.6} position={[20, 10, 10]} />
      <Suspense fallback={null}>
        <Arrow />
      </Suspense>
    </Canvas>
  )
}
