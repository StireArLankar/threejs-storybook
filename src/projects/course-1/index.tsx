import React, { useEffect } from 'react'
import { init } from './init'

export default () => {
  useEffect(() => {
    init('#scene')
  }, [])

  return <div id='scene' />
}
