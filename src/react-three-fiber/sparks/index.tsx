import * as THREE from 'three'
import React, { Suspense, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import lerp from '../../utils/lerp'
import { Effects } from './Effects'
import Sparks from './Sparks'
import { Particles } from './Particles'

function Ellipse(props: any) {
  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 10, 3, 0, 2 * Math.PI, false, 0)
    const points = curve.getPoints(50)
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  return (
    <line geometry={geometry} {...props}>
      <meshBasicMaterial attach='material' />
    </line>
  )
}

function ReactAtom(props: any) {
  return (
    <group {...props}>
      <Ellipse />
      <Ellipse rotation={[0, 0, Math.PI / 3]} />
      <Ellipse rotation={[0, 0, -Math.PI / 3]} />
      <mesh>
        <sphereBufferGeometry attach='geometry' args={[0.5, 32, 32]} />
        <meshBasicMaterial attach='material' color='red' />
      </mesh>
    </group>
  )
}

function Number({ mouse }: any) {
  const ref = useRef<any>()

  const { size, viewport } = useThree()

  const aspect = size.width / viewport.width

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = lerp(ref.current.position.x, mouse.current[0] / aspect / 10, 0.1)
      ref.current.rotation.x = lerp(ref.current.rotation.x, 0 + mouse.current[1] / aspect / 50, 0.1)
      ref.current.rotation.y = 0.8
    }
  })

  return (
    <Suspense fallback={null}>
      <group ref={ref}>
        <ReactAtom position={[35, -20, 0]} scale={[1, 0.5, 1]} />
      </group>
    </Suspense>
  )
}

export default () => {
  const [down, set] = useState(false)

  const mouse = useRef<[number, number]>([0, 0])

  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  )

  useEffect(() => {
    document.body.style.cursor =
      "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto"
  }, [])

  return (
    <Canvas
      camera={{ fov: 100, position: [0, 0, 30] }}
      onMouseMove={onMouseMove}
      onMouseUp={() => set(false)}
      onMouseDown={() => set(true)}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.Uncharted2ToneMapping
        gl.setClearColor(new THREE.Color('#020207'))
      }}
    >
      //@ts-ignore
      <fog attach='fog' args={['white', 50, 190]} />
      <pointLight distance={100} intensity={4} color={'white' as any} />
      <Number mouse={mouse} />
      <Particles count={10000} mouse={mouse} />
      <Sparks
        count={20}
        mouse={mouse}
        colors={['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']}
      />
      <Effects down={down} />
    </Canvas>
  )
}
