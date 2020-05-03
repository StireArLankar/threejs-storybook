import { Action } from 'overmind'

export const setWallTexture: Action<string> = ({ state }, texture) => {
  state.wallTexture = texture
}
