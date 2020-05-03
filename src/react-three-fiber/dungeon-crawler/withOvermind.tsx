import React from 'react'
import { Provider } from 'overmind-react'

import { overmind } from './overmind'

export const withOvermind = (storyfn: any) => {
  return <Provider value={overmind}>{storyfn()}</Provider>
}
