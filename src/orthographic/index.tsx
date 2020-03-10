import lerp from './lerp'
import React, { useRef, useEffect, PropsWithChildren, Suspense } from 'react'
import { Canvas, useFrame, Dom, useLoader } from 'react-three-fiber'
import { Block, useBlock } from './blocks'
import { TextureLoader, LinearFilter, Texture } from 'three'
import state from './store'
import './CustomMaterial'
import './style.css'

function Plane({ color = 'white', map, ...props }: any) {
  const { viewportHeight, offsetFactor } = useBlock()

  const material = useRef<any>()

  let last = state.top

  useFrame(() => {
    const { pages, top } = state
    material.current.scale = lerp(
      material.current.scale,
      offsetFactor - top / ((pages - 1) * viewportHeight),
      0.1
    )
    material.current.shift = lerp(material.current.shift, (top - last) / 150, 0.1)
    last = top
  })

  return (
    <mesh {...props}>
      <planeBufferGeometry attach='geometry' args={[1, 1, 32, 32]} />
      //@ts-ignore
      <customMaterial ref={material} attach='material' color={color} map={map} />
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
  map?: Texture
}

const Content = (props: PropsWithChildren<ContentProps>) => {
  const { left, children, map } = props

  const { contentMaxWidth, canvasWidth, margin } = useBlock()

  const aspect = 1.75

  const alignRight = (canvasWidth - contentMaxWidth - margin) / 2

  return (
    <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
      <Plane scale={[contentMaxWidth, contentMaxWidth / aspect, 1]} color='#bfe2ca' map={map} />
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

function Pages() {
  const textures = (useLoader(TextureLoader, state.images as any) as unknown) as Texture[]

  const [img1, img2, img3] = textures.map((texture) => {
    texture.minFilter = LinearFilter
    return texture
  })

  const { contentMaxWidth, mobile } = useBlock()
  const aspect = 1.75
  const pixelWidth = contentMaxWidth * state.zoom

  return (
    <>
      {/* First section */}
      <Block factor={1.5} offset={0}>
        <Content left map={img1}>
          <Dom
            style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: 'left' }}
            position={[-contentMaxWidth / 2, -contentMaxWidth / 2 / aspect - 0.4, 1]}
          >
            <>The substance can take you to heaven but it can also take you to hell.</>
          </Dom>
        </Content>
      </Block>

      {/* Second section */}
      <Block factor={2.0} offset={1}>
        <Content map={img2}>
          <Dom
            style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: 'right' }}
            position={[mobile ? -contentMaxWidth / 2 : 0, -contentMaxWidth / 2 / aspect - 0.4, 1]}
          >
            <>
              We’ve found that the people whose EEG doesn’t show any alpha-wave activity when
              they’re relaxed aren’t likely to respond significantly to the substance.
            </>
          </Dom>
        </Content>
      </Block>

      {/* Stripe */}
      <Block factor={-1.0} offset={1}>
        <Stripe />
      </Block>

      {/* Last section */}
      <Block factor={1.5} offset={2}>
        <Content left map={img3}>
          <Block factor={-0.5}>
            <Cross />
          </Block>
          <Dom
            style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: 'left' }}
            position={[-contentMaxWidth / 2, -contentMaxWidth / 2 / aspect - 0.4, 1]}
          >
            <>Education and enlightenment.</>
          </Dom>
        </Content>
      </Block>
    </>
  )
}

function Startup() {
  const ref = useRef<any>()

  useFrame(() => (ref.current.material.opacity = lerp(ref.current.material.opacity, 0, 0.025)))

  return (
    <mesh ref={ref} position={[0, 0, 200]} scale={[100, 100, 1]}>
      <planeBufferGeometry attach='geometry' />
      <meshBasicMaterial attach='material' color='#dfdfdf' transparent />
    </mesh>
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
      <Canvas className='canvas' orthographic camera={{ zoom: state.zoom, position: [0, 0, 500] }}>
        <Suspense fallback={<Dom center className='loading' children={<>"Loading..."</>} />}>
          <Pages />
          <Startup />
        </Suspense>
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

// export default () => {
//   const scrollArea = useRef<HTMLDivElement>(null)

//   const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
//     //@ts-ignore
//     state.top = e.target.scrollTop
//   }

//   useEffect(() => void onScroll({ target: scrollArea.current } as any), [])

//   return (
//     <>
//       <Canvas orthographic camera={{ zoom: state.zoom, position: [0, 0, 500] }}>
//         {/* First section */}
//         <Block factor={1.5} offset={0}>
//           <Content left>
//             <Block factor={-0.5}>
//               <Cross />
//             </Block>
//           </Content>
//         </Block>

//         {/* Second section */}
//         <Block factor={2.0} offset={1}>
//           <Content />
//         </Block>

//         {/* Stripe */}
//         <Block factor={-1.0} offset={1}>
//           <Stripe />
//         </Block>

//         {/* Last section */}
//         <Block factor={1.5} offset={2}>
//           <Content left>
//             <Block factor={-0.5}>
//               <Cross />
//             </Block>
//           </Content>
//         </Block>
//       </Canvas>

//       <div
//         className='scrollArea'
//         ref={scrollArea}
//         onScroll={onScroll}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100vw',
//           height: '100vh',
//           overflow: 'auto',
//         }}
//       >
//         <div style={{ height: `${state.pages * 100}vh` }} />
//       </div>
//     </>
//   )
// }
