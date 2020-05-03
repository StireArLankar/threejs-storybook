import React, { createContext, FC, Suspense, useMemo } from 'react'
import { useLoader } from 'react-three-fiber'
import * as THREE from 'three'

const imags = {
  wall: process.env.PUBLIC_URL + '/assets/brick.jpg',
  floor: process.env.PUBLIC_URL + '/assets/grassV2.png',
  ceiling: process.env.PUBLIC_URL + '/assets/wood.jpg',
}

type Value = Record<keyof typeof imags, THREE.Texture>

export const TextureContext = createContext<Value>({} as any)

const entries = Object.entries(imags)
const values = entries.map((entry) => entry[1])
const keys = entries.map((entry) => entry[0]) as (keyof typeof imags)[]

const Temp: FC<{}> = ({ children }) => {
  const textures = useLoader<THREE.Texture[]>(THREE.TextureLoader, values)

  const txt = useMemo(() => {
    return keys.reduce((acc, cur, index) => {
      acc[cur] = textures[index]
      return acc
    }, {} as Value)
  }, [textures])

  return <TextureContext.Provider value={txt}>{children}</TextureContext.Provider>
}

export const TextureProvider: FC<{}> = ({ children }) => (
  <Suspense fallback={null}>
    <Temp>{children}</Temp>
  </Suspense>
)
