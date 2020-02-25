import React, { useState, useRef, Fragment, memo, useContext, useMemo } from 'react'
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//@ts-ignore
import { useSpring, a } from 'react-spring/three'
import * as THREE from 'three'

extend({ OrbitControls })

const arrayComparator = (a: any[], b: any) => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

interface CtxModel {
  active: [number, number, number]
  setActive: React.Dispatch<React.SetStateAction<[number, number, number]>>
}

const CtrContext = React.createContext<CtxModel>({
  active: [0, 0, 0],
  setActive: () => {},
})

const Controls = () => {
  const { camera, gl } = useThree()
  const ref = useRef<any>()

  useFrame(() => {
    ref.current.update()
    ref.current.target = new THREE.Vector3(anim.x.getValue(), anim.y.getValue(), anim.z.getValue())
  })

  const { active } = useContext(CtrContext)

  const anim = useSpring({
    x: active[0],
    y: active[1],
    z: active[2],
  })

  //@ts-ignore
  return <orbitControls args={[camera, gl.domElement]} ref={ref} />
}

interface BoxProps {
  position: [number, number, number]
  size: [number, number, number]
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<number>>
  index: number
}

const Box = memo((props: BoxProps) => {
  const { position, size } = props
  const [isHovered, setIsHovered] = useState(false)

  const { active, setActive } = useContext(CtrContext)

  const pos = useMemo(() => [position[0], size[1] / 2, position[2]], [position, size])

  const pointerRef = useRef(false)

  const onClick = (evt: any) => {
    evt.stopPropagation()
    if (pointerRef.current) {
      pointerRef.current = false
      setActive(pos as any)
    }
  }

  const activeFlag = arrayComparator(active, pos)

  const { scale, color } = useSpring({
    scale: activeFlag ? [1.5, 1, 1.5] : [1, 1, 1],
    color: activeFlag ? 'green' : isHovered ? 'hotpink' : 'grey',
  })

  const onPointerOver = (evt: any) => {
    evt.stopPropagation()
    setIsHovered(true)
  }

  const onPointerOut = (evt: any) => {
    evt.stopPropagation()
    pointerRef.current = false
    setIsHovered(false)
  }

  return (
    <a.mesh
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerUp={onClick}
      onPointerDown={() => (pointerRef.current = true)}
      scale={scale}
      position={pos}
    >
      <boxBufferGeometry attach='geometry' args={size} />
      <a.meshLambertMaterial attach='material' color={color} />
    </a.mesh>
  )
})

const Boxes = () => {
  const [active, setActive] = useState(0)

  const renderBoxes = () =>
    Array.from({ length: 16 }, (_, k) => k).map((_, index) => (
      <Box
        key={index}
        position={[index % 4, 0, Math.floor(index / 4)]}
        size={[0.5, index * 0.25 + 0.5, 0.5]}
        active={active === index}
        index={index}
        setActive={setActive}
      />
    ))

  return <Fragment>{renderBoxes()}</Fragment>
}

export default () => {
  const [active, setActive] = useState<[number, number, number]>([0, 0, 0])

  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      <CtrContext.Provider value={{ active, setActive }}>
        <Controls />
        <ambientLight />
        <spotLight position={[5, 3, 10]} intensity={0.5} />
        <spotLight position={[-5, -3, 10]} intensity={0.5} />
        <Boxes />
      </CtrContext.Provider>
    </Canvas>
  )
}
