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

  // const light = new THREE.AmbientLight(0xffffff)
  const light2 = new THREE.DirectionalLight(0xffffff)
  light2.position.x = 7
  light2.position.y = 7
  light2.position.z = 7
  const lightHelper = new THREE.DirectionalLightHelper(light2, 5, 0x000000)
  scene.add(lightHelper)
  // scene.add(light)
  scene.add(light2)

  let ADD = 0.02

  let cube: THREE.Mesh

  const createGeometry = () => {
    const texture = new THREE.TextureLoader().load(process.env.PUBLIC_URL + '/assets/nepu.jpg')
    let geometry = new THREE.BoxGeometry(5, 5, 5)
    // let material = new THREE.MeshBasicMaterial({ map: texture })
    let material = new THREE.MeshPhongMaterial({ map: texture })

    cube = new THREE.Mesh(geometry, material)

    scene.add(cube)
  }

  createGeometry()

  const mainLoop = () => {
    if (isMounted) {
      cube.rotation.z -= ADD
      cube.rotation.x += ADD
      cube.rotation.y -= ADD

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
