import { Fire } from 'three/examples/jsm/objects/Fire'
import * as THREE from 'three'
import React, { memo } from 'react'

var params = {
  color1: '#ffffff',
  color2: '#ffa000',
  color3: '#000000',
  colorBias: 0.8,
  burnRate: 0.35,
  diffuse: 1.33,
  viscosity: 0.25,
  expansion: -0.25,
  swirl: 50.0,
  drag: 0.35,
  airSpeed: 12.0,
  windX: 0.0,
  windY: 0.75,
  speed: 500.0,
  massConservation: false,
}

export default memo((props: any) => {
  const plane = new THREE.PlaneBufferGeometry(20, 20)

  const fire = new Fire(plane, {
    textureWidth: 1024,
    textureHeight: 1024,
    debug: false,
    colorBias: params.colorBias,
    burnRate: params.burnRate,
    diffuse: params.diffuse,
    viscosity: params.viscosity,
    expansion: params.expansion,
    swirl: params.swirl,
    drag: params.drag,
    airSpeed: params.airSpeed,
    speed: params.speed,
    massConservation: params.massConservation,
  })

  fire.addSource(0.5, 0.1, 0.05, 1, 0.0, 0.2)

  return (
    <group>
      <primitive object={plane} />
      <primitive
        object={fire}
        color1={params.color1}
        color2={params.color2}
        color3={params.color3}
      />
    </group>
  )
})
