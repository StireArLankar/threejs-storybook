import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const randInt = (x: number, y: number) => Math.random() * (x - y) + y

const getStartAndEnd = ({ x, y }: { x: number; y: number }) => {
  const z = randInt(-100, 100)

  return {
    start: new THREE.Vector3(randInt(x - 100, x + 100), y - 800, z),
    end: new THREE.Vector3(randInt(x - 100, x + 100), y, z),
  }
}

export interface FireworkProps {
  x: number
  y: number
  onDestroy: () => void
}

const generateCoords = ({ x, y, z }: THREE.Vector3, offset: number, amount: number) => {
  const arr: THREE.Vector3[] = []

  for (var i = 0; i < amount; i++) {
    arr.push(
      new THREE.Vector3(
        randInt(x - offset, x + offset),
        randInt(y - offset, y + offset),
        randInt(z - offset, z + offset)
      )
    )
  }

  return arr
}

const generateColors = (amount: number) => {
  const arr: THREE.Color[] = []

  for (var i = 0; i < amount; i++) {
    arr.push(new THREE.Color(`hsl(${randInt(0, 360)}, 100%, 50%)`))
  }

  return arr
}

export const Firework = (props: FireworkProps) => {
  const { onDestroy } = props
  const [isExploded, setIsExploded] = useState(false)

  const startAndEnd = useRef(getStartAndEnd(props))
  const endCoords = useMemo(() => generateCoords(startAndEnd.current.end, 200, 200), [])

  const geometry = useMemo(() => {
    const geo = new THREE.Geometry()

    geo.colors = isExploded ? generateColors(200) : generateColors(1)
    geo.vertices = isExploded
      ? generateCoords(startAndEnd.current.end, 1, 200)
      : [startAndEnd.current.start]

    return geo
  }, [isExploded])

  useFrame(() => {
    const { length } = geometry.vertices

    if (material.current.opacity < 0) {
      return onDestroy()
    }

    if (length === 1) {
      const { end } = startAndEnd.current
      const particle = geometry.vertices[0]

      particle.lerp(end, 0.05)

      if (Math.ceil(particle.y) > end.y - 20) {
        setIsExploded(true)
      }
    } else {
      geometry.vertices.forEach((particle, i) => {
        particle.lerp(endCoords[i], 0.05)
      })

      material.current.opacity -= 0.015
    }

    material.current.colorsNeedUpdate = true
    geometry.verticesNeedUpdate = true
  })

  const material = useRef<any>()

  return (
    <points frustumCulled={false}>
      <primitive object={geometry} attach='geometry' />
      <pointsMaterial
        attach='material'
        size={isExploded ? 3 : 10}
        transparent={true}
        opacity={1}
        vertexColors={true as any}
        depthTest={false}
        ref={material}
      />
    </points>
  )
}
