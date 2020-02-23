import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'

import './index.css'

const initCamera = (container: Element) => {
  const fov = 35
  const aspect = container.clientWidth / container.clientHeight
  const near = 0.1
  const far = 1000

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 0, 15)

  return camera
}

const initLights = () => {
  const ambient = new THREE.AmbientLight(0x404040, 2)

  const light = new THREE.DirectionalLight(0xffffff, 2)
  light.position.set(50, 50, 100)

  return [ambient, light]
}

const initRenderer = (container: Element) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  return renderer
}

const initResizeHandler = (
  camera: THREE.PerspectiveCamera,
  container: Element,
  renderer: THREE.WebGLRenderer
) => {
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, container.clientHeight)
  })
}

export const init = (selector: string) => {
  let isMounted = true
  const container = document.querySelector(selector)
  const elements: Record<string, THREE.Object3D> = {}

  if (!container) {
    throw new Error('No container!')
  }

  const scene = new THREE.Scene()
  const camera = initCamera(container)

  const lights = initLights()
  lights.forEach((light) => scene.add(light))

  const renderer = initRenderer(container)

  const updateRenderer = () => renderer.render(scene, camera)

  container.appendChild(renderer.domElement)

  const animateElement = (element: THREE.Object3D) =>
    function anim() {
      if (isMounted) {
        requestAnimationFrame(anim)
        element.rotation.z += 0.005
        updateRenderer()
      }
    }

  const loader = new GLTFLoader()

  loader.load(process.env.PUBLIC_URL + '/assets/house/scene.gltf', (gltf) => {
    scene.add(gltf.scene)
    elements.house = gltf.scene.children[0]
    elements.house.translateZ(-2)
    animateElement(elements.house)()
  })

  initResizeHandler(camera, container, renderer)

  // const raycaster = new THREE.Raycaster() // create once
  // const mouse = new THREE.Vector2() // create once

  // function onMouseMove(event: MouseEvent) {
  //   mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
  //   mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

  //   raycaster.setFromCamera(mouse, camera)

  //   const intersects = raycaster.intersectObjects([elements.house], true)

  //   if (intersects.length > 0) {
  //     elements.house.rotation.x += 0.001
  //   } else {
  //     elements.house.translateX(0)
  //   }
  // }

  // document.addEventListener('mousemove', onMouseMove)

  return () => (isMounted = false)
}
