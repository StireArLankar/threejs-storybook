import React, { createContext, useRef, useContext, PropsWithChildren } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import lerp from './lerp'
import state from './store'

const offsetContext = createContext(0)

interface BlockProps {
  offset?: number
  factor: number
}

function Block(props: PropsWithChildren<BlockProps>) {
  const { children, offset, factor, ...rest } = props

  const { offset: parentOffset, sectionHeight } = useBlock()

  const ref = useRef<any>()

  const offsetValue = offset !== undefined ? offset : parentOffset

  useFrame(() => {
    const curY = ref.current.position.y
    const curTop = state.top
    ref.current.position.y = lerp(curY, (curTop / state.zoom) * factor, 0.1)
  })

  return (
    <offsetContext.Provider value={offsetValue}>
      <group {...rest} position={[0, -sectionHeight * offsetValue * factor, 0]}>
        <group ref={ref}>{children}</group>
      </group>
    </offsetContext.Provider>
  )
}

function useBlock() {
  const { sections, pages, zoom } = state

  const { size, viewport } = useThree()

  const offset = useContext(offsetContext)

  const viewportWidth = viewport.width
  const viewportHeight = viewport.height
  const canvasWidth = viewportWidth / zoom
  const canvasHeight = viewportHeight / zoom
  const mobile = size.width < 700
  const margin = canvasWidth * (mobile ? 0.2 : 0.1)
  const contentMaxWidth = canvasWidth * (mobile ? 0.8 : 0.6)
  const sectionHeight = canvasHeight * ((pages - 1) / (sections - 1))
  const offsetFactor = (offset + 1.0) / sections

  return {
    viewport,
    offset,
    viewportWidth,
    viewportHeight,
    canvasWidth,
    canvasHeight,
    mobile,
    margin,
    contentMaxWidth,
    sectionHeight,
    offsetFactor,
  }
}

export { Block, useBlock }
