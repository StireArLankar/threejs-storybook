import lerp from './lerp'
import React, { useRef, useEffect, PropsWithChildren } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { Block, useBlock } from './blocks'
import state from './store'

function Plane({ color = 'white', ...props }) {
  return (
    <mesh {...props}>
      <planeBufferGeometry attach='geometry' />
      <meshBasicMaterial attach='material' color={color} />
    </mesh>
  )
}

const Cross = () => {
  const ref = useRef<any>()

  const { viewportHeight } = useBlock()

  useFrame(() => {
    const curTop = state.top
    const curY = ref.current.rotation.z
    const nextY = (curTop / ((state.pages - 1) * viewportHeight)) * Math.PI
    ref.current.rotation.z = lerp(curY, nextY, 0.1)
  })

  return (
    <group ref={ref} scale={[2, 2, 2]}>
      <Plane scale={[1, 0.2, 1]} color='#e2bfca' />
      <Plane scale={[0.2, 1, 1]} color='#e2bfca' />
    </group>
  )
}

interface ContentProps {
  left?: boolean
}

const Content = (props: PropsWithChildren<ContentProps>) => {
  const { left, children } = props

  const { contentMaxWidth, canvasWidth, margin } = useBlock()

  const aspect = 1.75

  const alignRight = (canvasWidth - contentMaxWidth - margin) / 2

  return (
    <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
      <Plane scale={[contentMaxWidth, contentMaxWidth / aspect, 1]} color='#bfe2ca' />
      {children}
    </group>
  )
}

function Stripe() {
  const { contentMaxWidth } = useBlock()

  return (
    <Plane
      scale={[100, contentMaxWidth, 1]}
      rotation={[0, 0, Math.PI / 4]}
      position={[0, 0, -1]}
      color='#e3f6f5'
    />
  )
}

export default () => {
  const scrollArea = useRef<HTMLDivElement>(null)

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    //@ts-ignore
    state.top = e.target.scrollTop
  }

  useEffect(() => void onScroll({ target: scrollArea.current } as any), [])

  return (
    <>
      <Canvas orthographic camera={{ zoom: state.zoom, position: [0, 0, 500] }}>
        {/* First section */}
        <Block factor={1.5} offset={0}>
          <Content left>
            <Block factor={-0.5}>
              <Cross />
            </Block>
          </Content>
        </Block>

        {/* Second section */}
        <Block factor={2.0} offset={1}>
          <Content />
        </Block>

        {/* Stripe */}
        <Block factor={-1.0} offset={1}>
          <Stripe />
        </Block>

        {/* Last section */}
        <Block factor={1.5} offset={2}>
          <Content left>
            <Block factor={-0.5}>
              <Cross />
            </Block>
          </Content>
        </Block>
      </Canvas>

      <div
        className='scrollArea'
        ref={scrollArea}
        onScroll={onScroll}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  )
}
