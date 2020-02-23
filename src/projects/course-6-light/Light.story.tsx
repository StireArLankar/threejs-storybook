import React from 'react'
import App from '.'
import Hemisphere from './hemisphere'
import Directional from './directional'
import Point from './point'
import Spot from './spot'

export default {
  title: 'Light',
  component: App,
}

export const ambient = () => <App />
export const hemisphere = () => <Hemisphere />
export const directional = () => <Directional />
export const point = () => <Point />
export const spot = () => <Spot />
