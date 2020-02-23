import React, { useEffect } from 'react'
import { init } from './init'

export const Home = () => {
  useEffect(() => {
    init('#scene')
  }, [])

  return <div id='scene' />
}
