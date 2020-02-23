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

  let Geometry: THREE.Mesh
  const geometry = new THREE.Geometry()

  let ADD = 0.05

  const createGeometry = () => {
    geometry.vertices.push(new THREE.Vector3(3, 0, 0))
    geometry.vertices.push(new THREE.Vector3(0, 2, 0))
    geometry.vertices.push(new THREE.Vector3(0, 0, 1))
    geometry.vertices.push(new THREE.Vector3(0, 0, 0))

    geometry.faces.push(new THREE.Face3(0, 1, 2))
    geometry.faces.push(new THREE.Face3(1, 2, 3))
    geometry.faces.push(new THREE.Face3(0, 1, 3))

    const material = new THREE.MeshBasicMaterial({
      color: 0x00a1cb,
      side: THREE.DoubleSide,
      wireframe: true,
    })

    Geometry = new THREE.Mesh(geometry, material)

    Geometry.rotation.x = 1
    Geometry.rotation.y = 1

    scene.add(Geometry)
  }

  createGeometry()

  const axes = new THREE.AxesHelper(3)
  scene.add(axes)

  const mainLoop = () => {
    if (isMounted) {
      geometry.vertices[0].x += ADD
      geometry.verticesNeedUpdate = true

      if (geometry.vertices[0].x <= -5 || geometry.vertices[0].x >= 5) {
        ADD *= -1
      }

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
