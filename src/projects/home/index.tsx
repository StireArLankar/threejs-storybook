import React, { useEffect } from 'react'
import { init } from './init'

export const Home = () => {
  useEffect(() => {
    const stop = init('#scene')
    return () => void stop()
  }, [])

  return <div id='scene' />
}
