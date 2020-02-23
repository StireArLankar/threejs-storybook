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
  camera.position.z = 15

  // create the renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  let sphere: any
  let rings: any[] = []

  let ADD = 0.02

  const createSphere = () => {
    const geometry = new THREE.SphereGeometry(1, 30, 30)
    const material = new THREE.MeshBasicMaterial({ color: 0x00a1cb })
    sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)
  }

  createSphere()

  const createRings = (radius: number) => {
    const geometry = new THREE.TorusGeometry(radius, 0.3, 2, 30)
    const material = new THREE.MeshBasicMaterial({ color: 0xffa1cb })

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.rotation.y = 0.3
    rings.push(ring)
    scene.add(ring)
  }

  const axes = new THREE.AxesHelper(3)
  scene.add(axes)

  createRings(1.4)
  createRings(2.3)

  const mainLoop = () => {
    if (isMounted) {
      sphere.position.y += ADD
      rings.forEach((ring) => (ring.position.y += ADD))

      if (sphere.position.y <= -2 || sphere.position.y >= 2) {
        ADD *= -1
      }

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
