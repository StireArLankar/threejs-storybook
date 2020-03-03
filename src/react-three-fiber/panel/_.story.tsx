import React from 'react'
import Component from '.'
import Component2 from './rotating'
import Component3 from './multiple'

export default {
  title: 'react-three-fiber | Panel',
  component: Component,
}

export const example = () => <Component />
export const panels = () => <Component2 />
export const multiple = () => <Component3 />
