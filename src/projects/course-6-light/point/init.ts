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

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 20

  // create the renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  const light = new THREE.PointLight(0xffffff, 2, 20, 2)
  light.position.y = 5
  const light2 = new THREE.PointLight(0xffffff, 2, 20, 2)

  scene.add(light)
  scene.add(light2)

  let ADD = 0.05

  let cube: THREE.Mesh
  let sphere1: THREE.Mesh
  let sphere2: THREE.Mesh

  const createGeometry = () => {
    let geometry = new THREE.BoxGeometry(5, 5, 5)
    let material = new THREE.MeshPhongMaterial({
      color: 0xdff913,
      shininess: 100,
      side: THREE.DoubleSide,
    })
    cube = new THREE.Mesh(geometry, material)
    cube.rotation.x = 0.6
    cube.rotation.y = 0.6

    const geometry2 = new THREE.SphereGeometry(0.1, 30, 30)
    const material2 = new THREE.MeshBasicMaterial({ color: 0xffffff })
    sphere1 = new THREE.Mesh(geometry2, material2)

    const geometry3 = new THREE.SphereGeometry(0.1, 30, 30)
    const material3 = new THREE.MeshBasicMaterial({ color: 0xffffff })
    sphere2 = new THREE.Mesh(geometry3, material3)

    scene.add(cube)
    scene.add(sphere1)
    scene.add(sphere2)
  }

  createGeometry()

  //@ts-ignore
  light.target = cube

  let theta = 0

  const mainLoop = () => {
    if (isMounted) {
      light.position.x = 10 * Math.sin(theta)
      light.position.z = 10 * Math.cos(theta)
      sphere1.position.x = light.position.x
      sphere1.position.z = light.position.z

      light2.position.y = -10 * Math.sin(theta)
      light2.position.z = -10 * Math.cos(theta)
      sphere2.position.y = light2.position.y
      sphere2.position.z = light2.position.z

      theta += ADD

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
