import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import { Firework } from './Firework'

interface StateItem {
  id: string
  x: number
  y: number
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
        id: (Date.now() + Math.random()).toString(),
      }

      setArray((prev) => [newItem, ...prev.slice(0, 100)])

      timer = setTimeout(handler, 2000)
    }

    timer = setTimeout(handler, 2000)

    return () => clearTimeout(timer)
  }, [])

  const onDestroy = (id: string) => () => setArray((prev) => prev.filter((item) => item.id !== id))

  const renderFireworks = () =>
    array.map((star) => <Firework key={star.id} {...star} onDestroy={onDestroy(star.id)} />)

  useEffect(() => {
    const newItem = {
      x: props.x / aspect.current,
      y: props.y / aspect.current,
      id: Date.now().toString(),
    }

    setArray((prev) => [newItem, ...prev.slice(0, 100)])
  }, [props])

  return <>{renderFireworks()}</>
}

export default () => {
  const [state, setState] = useState({ x: 0, y: 0 })

  return (
    <Canvas
      camera={{ fov: 60, position: [0, 0, 500] }}
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
