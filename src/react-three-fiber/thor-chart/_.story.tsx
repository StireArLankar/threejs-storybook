import React from 'react'
import Component from '.'
import Component2 from './no-light'

export default {
  title: 'react-three-fiber | Thor chart',
  component: Component,
}

export const noLight = () => <Component2 />
export const example = () => <Component />
