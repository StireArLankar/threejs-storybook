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

  const light = new THREE.HemisphereLight(0xffffff, 0x000000)
  scene.add(light)

  let ADD = 0.02

  let cube: THREE.Mesh
  let cone: THREE.Mesh
  let plane: THREE.Mesh

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

    scene.add(cube)
    scene.add(cone)
    scene.add(plane)
  }

  createGeometry()

  const mainLoop = () => {
    if (isMounted) {
      light.intensity += ADD
      if (light.intensity >= 4 || light.intensity <= 0.5) {
        ADD *= -1
      }

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
