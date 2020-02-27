import React, { useRef, useContext, useCallback } from 'react'
//@ts-ignore
import { useSpring, a } from 'react-spring/three'
import { vector, CtrContext, arrayComparator } from '.'
import { Thor } from './Thor'
import * as THREE from 'three'

export interface ThorsGroupProps {
  position: vector
  data: number[]
}

export const ThorsGroup = (props: ThorsGroupProps) => {
  const { position, data } = props
  const targetRef = useRef(new THREE.Object3D())

  const { active, setActive } = useContext(CtrContext)

  const onClick = () => {
    setActive((prev) => (arrayComparator(prev, position) ? prev : position))
  }

  const ref = useRef<any>()

  const asyncTo = useCallback(async (next: any) => {
    while (1) {
      await next({ rotation: [0, Math.PI * 2, 0] })
      await next({ rotation: [0, 0, 0] })
    }
  }, [])

  const [{ rotation }] = useSpring(() => ({
    from: {
      rotation: [0, 0, 0],
    },
    to: asyncTo,
    config: { tension: 10, friction: 20 },
  }))

  return (
    <a.group position={position} ref={ref} rotation={rotation}>
      <primitive object={targetRef.current} position={[0, 0, 0]} />

      {data.map((item, index) => (
        <Thor
          position={[0, 0, 0]}
          key={index}
          arc={item}
          index={index}
          amount={data.length}
          onClick={onClick}
          active={active === position}
        />
      ))}

      <spotLight
        intensity={0.7}
        target={targetRef.current}
        position={[0, 10, 0]}
        castShadow
        angle={0.4}
        penumbra={0.1}
      />
    </a.group>
  )
}
