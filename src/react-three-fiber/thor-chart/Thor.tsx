import React, { memo, useContext, useMemo, useRef } from 'react'
//@ts-ignore
// import { useSpring, a } from 'react-spring/three'

import { vector, CtrContext, arrayComparator } from './index'

interface ThorProps {
  position: vector
  arc: number
  index: number
  amount: number
}

export const Thor = memo((props: ThorProps) => {
  const { position, arc, index, amount } = props

  const { setActive } = useContext(CtrContext)

  const pos = useMemo<vector>(() => [position[0], (index + 1) * 0.1, position[2]], [
    position,
    index,
  ])

  const size = amount - index

  const torusArgs = useMemo(() => [3, size * 0.1 + 0.1, 2, 100, (Math.PI * 2 * arc) / 100], [
    arc,
    size,
  ])

  const pointerRef = useRef(false)

  const onClick = (evt: any) => {
    evt.stopPropagation()
    if (pointerRef.current) {
      pointerRef.current = false
      setActive((prev) => (arrayComparator(prev, pos) ? prev : pos))
    }
  }

  const onPointerOver = (evt: any) => {
    evt.stopPropagation()
  }

  const onPointerOut = (evt: any) => {
    evt.stopPropagation()
    pointerRef.current = false
  }

  return (
    <mesh
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerUp={onClick}
      onPointerDown={() => (pointerRef.current = true)}
      position={pos}
      rotation={[Math.PI / 2, 0, -Math.PI / 2]}
    >
      <torusBufferGeometry attach='geometry' args={torusArgs as any} />
      <meshLambertMaterial attach='material' color={`hsl(${index * 100}, 100%, 20%)`} />
    </mesh>
  )
})
