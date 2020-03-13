import React, { useCallback, useEffect, useMemo, useRef } from 'react'
//@ts-ignore
import { useSpring } from 'react-spring/three'
import * as THREE from 'three'

const g = (value: number) => (Math.random() * 2 - 1) * value

const r = () => new THREE.Vector3(g(10), g(10), g(10))

export const Tube = ({ index }: { index: number }) => {
  const isMounted = useRef(true)

  useEffect(() => () => void (isMounted.current = false), [])

  const asyncTo = useCallback(async (next: any) => {
    while (isMounted.current) {
      await next({ x: 1215 })
      await next({ x: -12 })
    }
  }, [])

  const ref = useRef<any>()

  useSpring(() => ({
    from: { x: -12 },
    to: asyncTo,
    delay: index * 200,
    config: { duration: 4000 },
    onFrame: ({ x }: any) => {
      let s = x.toFixed(0) * 4
      s = s - (s % 12)
      ref.current?.setDrawRange(s, s + 12)
    },
  }))

  const [curve, emissive] = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([r(), r(), r(), r()])
    const emissive = new THREE.Color().setHSL(Math.random(), 0.6, 0.7)
    return [curve, emissive]
  }, [])

  return (
    <mesh castShadow>
      <tubeBufferGeometry attach='geometry' args={[curve, 400, 0.25, 2, false]} ref={ref} />
      <meshPhongMaterial attach='material' flatShading={false} emissive={emissive} />
    </mesh>
  )
}
