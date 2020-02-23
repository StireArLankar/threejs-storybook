import React, { useEffect } from 'react'
import { init } from './init'

export default () => {
  useEffect(() => {
    const stop = init('#scene')
    return () => void stop()
  }, [])

  return <div id='scene' />
}
