import React, { memo, useMemo, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const getTexture = (color: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  )
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, color)
  gradient.addColorStop(0.4, color)
  gradient.addColorStop(1, 'rgba(0,0,0,1)')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

export interface StarSystemProps {
  length: number
  x: number
  y: number
  color: string
}

const movementSpeed = 2

export const StarSystem = memo((props: StarSystemProps) => {
  const { length, x, y, color } = props

  const meshRef = useRef<any>()

  const geometry = useMemo(() => {
    const starGeo = new THREE.Geometry()

    for (let i = 0; i < length; i++) {
      const particle = new THREE.Vector3(x, y, 0) as any

      particle.dirs = {
        x: Math.random() * movementSpeed - movementSpeed / 2,
        y: Math.random() * movementSpeed - movementSpeed / 2,
        z: Math.random() * movementSpeed - movementSpeed / 2,
      }

      starGeo.vertices.push(particle)
    }

    return starGeo
  }, [length, x, y])

  useFrame(() => {
    geometry.vertices.forEach((particle: any) => {
      particle.x += particle.dirs.x
      particle.y += particle.dirs.y
      particle.z += particle.dirs.z
    })

    geometry.verticesNeedUpdate = true
  })

  return (
    <points ref={meshRef}>
      <primitive object={geometry} attach='geometry' />
      <pointsMaterial
        attach='material'
        color='#aaaaaa'
        size={1}
        transparent={true}
        blending={THREE.AdditiveBlending}
        map={getTexture(color)}
        depthTest={false}
      />
    </points>
  )
})
