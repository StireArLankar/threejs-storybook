import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { StarSystem } from './StarSystem'

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min
}

const getPastelColor = () => {
  const col = new THREE.Color(
    `hsl(${random(0, 360)}, ${Math.floor(25 + 70 * Math.random())}%, ${Math.floor(
      85 + 10 * Math.random()
    )}%)`
  )
  return `#${col.getHexString()}`
}

interface StateItem {
  id: string
  x: number
  y: number
  color: string
}

interface FireworksProps {
  x: number
  y: number
}

const Fireworks = (props: FireworksProps) => {
  const [array, setArray] = useState<StateItem[]>([])

  const { size, viewport } = useThree()

  const aspect = useRef(size.width / viewport.width)

  useEffect(() => {
    aspect.current = size.width / viewport.width
  }, [size, viewport])

  useEffect(() => {
    let timer: any

    const handler = () => {
      const newItem = {
        x: 0,
        y: 0,
        color: getPastelColor(),
        id: (Date.now() + Math.random()).toString(),
      }

      setArray((prev) => [newItem, ...prev.slice(0, 100)])

      timer = setTimeout(handler, 5000)
    }

    timer = setTimeout(handler, 5000)

    return () => clearTimeout(timer)
  }, [])

  const renderStarSystems = () =>
    array.map((star) => <StarSystem key={star.id} {...star} length={500} />)

  useEffect(() => {
    const newItem = {
      x: props.x / aspect.current,
      y: props.y / aspect.current,
      color: getPastelColor(),
      id: Date.now().toString(),
    }

    setArray((prev) => [newItem, ...prev.slice(0, 100)])
  }, [props])

  return <>{renderStarSystems()}</>
}

export default () => {
  const [state, setState] = useState({ x: 0, y: 0 })

  return (
    <Canvas
      camera={{ fov: 60, position: [0, 0, 50] }}
      style={{ backgroundColor: 'black' }}
      onPointerDown={({ clientX: x, clientY: y }) => {
        setState({
          x: x - window.innerWidth / 2,
          y: -y + window.innerHeight / 2,
        })
      }}
    >
      <ambientLight args={['#ffffff']} intensity={0.5} />

      <Fireworks {...state} />
    </Canvas>
  )
}
