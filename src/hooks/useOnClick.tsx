import { useMemo, useRef, useCallback } from 'react'

export const useOnClick = (action: () => void) => {
  const pointerRef = useRef(false)

  const onPointerUp = useCallback(
    (evt: any) => {
      evt.stopPropagation()
      if (pointerRef.current) {
        pointerRef.current = false
        action()
      }
    },
    [action]
  )

  return useMemo(
    () => ({
      onPointerOver: (evt: any) => {
        evt.stopPropagation()
      },
      onPointerOut: (evt: any) => {
        evt.stopPropagation()
        pointerRef.current = false
      },
      onPointerDown: () => {
        pointerRef.current = true
      },
      onPointerUp,
    }),
    [onPointerUp]
  )
}
