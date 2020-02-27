import React, { memo, useMemo, useRef, useEffect } from 'react'
import { vector } from './index'
//@ts-ignore
import { useSpring, a } from 'react-spring/three'

interface ThorProps {
  position: vector
  arc: number
  index: number
  amount: number
  active: boolean

  onClick: () => void
}

export const Thor = memo((props: ThorProps) => {
  const { position, arc, index, amount, onClick, active } = props

  // const pos = useMemo<vector>(() => [position[0], (index + 1) * 0.1, position[2]], [
  //   position,
  //   index,
  // ])

  const { pos } = useSpring({
    pos: [position[0], (index + 1) * (active ? 0.3 : 0.1), position[2]],
    config: {
      mass: 20,
      tension: 100,
    },
  })

  // const pos = [position[0], (index + 1) * 0.3, position[2]]

  console.log('test')
  // const [{pos}, set] = useSpring(() => ({
  //   pos: [position[0], (index + 1) * 0.1 ,position[2]]
  // }))

  // useEffect(() => {
  //   set({pos: [position[0], (index + 1) * 0.2, position[2]]})
  // }, [set, position, index, active])

  const size = amount - index

  const torusArgs = useMemo(() => [3, size * 0.1 + 0.1, 2, 100, (Math.PI * 2 * arc) / 100], [
    arc,
    size,
  ])

  const pointerRef = useRef(false)

  const onItemClick = (evt: any) => {
    evt.stopPropagation()
    if (pointerRef.current) {
      pointerRef.current = false
      onClick()
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
    <a.mesh
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerUp={onItemClick}
      onPointerDown={() => (pointerRef.current = true)}
      position={pos}
      rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      castShadow
    >
      <torusBufferGeometry attach='geometry' args={torusArgs as any} />
      <meshLambertMaterial attach='material' color={`hsl(${index * 100}, 100%, 30%)`} />
    </a.mesh>
  )
})
