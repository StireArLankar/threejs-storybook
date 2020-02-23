import * as THREE from 'three'

let scene: any
let camera: any
let renderer: any

export const init = (selector: string) => {
  let isMounted = true
  const container = document.querySelector(selector)

  if (!container) {
    throw new Error('No container!')
  }

  // create the scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xababab)

  // create an locate the camera

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 5

  // create the renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  let cube: any

  let ADD = 0.1

  let createCube = function() {
    let geometry = new THREE.BoxGeometry(1, 1, 1)
    let material = new THREE.MeshBasicMaterial({ color: 0x00a1cb })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
  }

  createCube()

  const mainLoop = () => {
    if (isMounted) {
      cube.position.x += ADD
      cube.rotation.z -= ADD

      if (cube.position.x <= -3 || cube.position.x >= 3) {
        ADD *= -1
      }

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
