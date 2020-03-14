import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from './post/Glitchpass'
import { WaterPass } from './post/Waterpass'

extend({ EffectComposer, ShaderPass, RenderPass, WaterPass, UnrealBloomPass, FilmPass, GlitchPass })

export interface EffectsProps {
  down?: boolean
}
export const Effects = ({ down }: EffectsProps) => {
  const composer = useRef<any>()

  const { scene, gl, size, camera } = useThree()

  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])

  useEffect(() => void composer.current.setSize(size.width, size.height), [size])

  useFrame(() => composer.current.render(), 1)

  return (
    //@ts-ignore
    <effectComposer ref={composer} args={[gl]}>
      //@ts-ignore
      <renderPass attachArray='passes' scene={scene} camera={camera} />
      //@ts-ignore
      <waterPass attachArray='passes' factor={1.5} />
      //@ts-ignore
      <unrealBloomPass attachArray='passes' args={[aspect, 2, 1, 0]} />
      //@ts-ignore
      <glitchPass attachArray='passes' factor={down ? 1 : 0} />
      //@ts-ignore
    </effectComposer>
  )
}
