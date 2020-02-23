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

  const light = new THREE.DirectionalLight(0xffffff)
  light.position.x = 10
  light.position.y = 4
  light.position.z = 5

  scene.add(light)

  const lightHelper = new THREE.DirectionalLightHelper(light, 5, 0x000000)
  scene.add(lightHelper)

  let ADD = 0.05

  let cube: THREE.Mesh
  let cone: THREE.Mesh
  let plane: THREE.Mesh
  let sphere: THREE.Mesh

  const createGeometry = () => {
    let geometry = new THREE.BoxGeometry(5, 5, 5)
    let material = new THREE.MeshPhongMaterial({
      color: 0x0f1d89,
      shininess: 100,
      side: THREE.DoubleSide,
    })

    cube = new THREE.Mesh(geometry, material)
    cube.position.z = -6
    cube.position.y = -5
    cube.position.x = -6

    let geometry2 = new THREE.ConeGeometry(3, 4, 20, 1, true)
    cone = new THREE.Mesh(geometry2, material)
    cone.position.x = 7
    cone.position.y = -5

    const geometry3 = new THREE.PlaneGeometry(1000, 1000, 50, 50)
    material = new THREE.MeshPhongMaterial({ color: 0x693421, side: THREE.DoubleSide })
    plane = new THREE.Mesh(geometry3, material)
    plane.rotation.x = Math.PI / 2
    plane.position.y = -100

    const geometry4 = new THREE.SphereGeometry(1, 30, 30)
    const material4 = new THREE.MeshBasicMaterial({ color: 0xffd700 })
    sphere = new THREE.Mesh(geometry4, material4)
    sphere.position.x = 10
    sphere.position.y = 4
    sphere.position.z = 5

    scene.add(cube)
    scene.add(cone)
    scene.add(plane)
    scene.add(sphere)
  }

  createGeometry()

  //@ts-ignore
  light.target = cube

  const mainLoop = () => {
    if (isMounted) {
      light.position.x += ADD
      sphere.position.x += ADD
      if (light.position.x > 10 || light.position.x < -10) ADD *= -1

      lightHelper.update()

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
