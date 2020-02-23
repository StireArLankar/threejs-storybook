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
  scene.background = new THREE.Color(0x000000)

  // create an locate the camera

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 20

  // create the renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  camera.position.set(0, 10, 20)

  const spotLight = new THREE.SpotLight(0xffffff, 1)
  spotLight.position.set(15, 20, 10)
  spotLight.angle = Math.PI / 20
  spotLight.penumbra = 0.05
  spotLight.decay = 2
  spotLight.distance = 200

  scene.add(spotLight)

  let ADD = 0.01

  let cube: THREE.Mesh
  let plane: THREE.Mesh

  let createGeometry = function() {
    let geometry = new THREE.BoxGeometry(5, 5, 5)
    let material = new THREE.MeshPhongMaterial({
      color: 0xdff913,
      shininess: 100,
      side: THREE.DoubleSide,
    })
    cube = new THREE.Mesh(geometry, material)
    cube.position.set(5, 0, 0)

    geometry = new THREE.BoxGeometry(2000, 1, 2000)
    material = new THREE.MeshPhongMaterial({ color: 0x693421, side: THREE.DoubleSide })
    plane = new THREE.Mesh(geometry, material)
    plane.position.y = -1

    scene.add(cube)
    scene.add(plane)
  }

  createGeometry()

  const mainLoop = () => {
    if (isMounted) {
      spotLight.angle += ADD
      if (spotLight.angle > Math.PI / 2 || spotLight.angle < 0.01) {
        ADD *= -1
      }

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
