import React from 'react'
import Floor from './Floor'
import Wall from './Wall'
import Ceiling from './Ceiling'
import { withStoryCanvas } from './withStoryCanvas'
import * as Tiles from './Tiles'

export default {
  title: 'react-three-fiber | Dungeon Crawler',
  decorators: [withStoryCanvas],
}

export const floor = () => (
  <>
    <Floor />
    <Floor position-x={10} />
  </>
)

export const wall = () => (
  <>
    <Wall position-z={-5} />
    <Wall position-x={10} position-z={-5} />
  </>
)

export const ceiling = () => (
  <>
    <Ceiling />
    <Ceiling position-x={10} />
  </>
)

export const tile1way = () => <Tiles.Tile1Ways />
export const tile2way = () => <Tiles.Tile2Ways />
export const tile3way = () => <Tiles.Tile3Ways />
export const tile4way = () => <Tiles.Tile4Ways />

export const pathExample = () => (
  <>
    <Tiles.Tile2Ways />
    <Tiles.Tile2Ways position-x={10} />
    <Tiles.Tile3Ways position-x={20} />
    <Tiles.Tile1Ways position-x={20} position-z={-10} rotation-y={Math.PI * 0.5} />
    <Tiles.Tile1Ways position-x={30} />
  </>
)
