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

  var light = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(light)

  var light2 = new THREE.PointLight(0xffffff, 0.5)
  scene.add(light2)

  let ADD = 0.05

  let cube1: THREE.Mesh
  let cube2: THREE.Mesh
  let cube3: THREE.Mesh
  let plane: THREE.Mesh

  const createObjects = () => {
    let geometry = new THREE.BoxGeometry(5, 5, 5)
    let material = new THREE.MeshBasicMaterial({
      color: 0xc9b92b,
      transparent: true,
      opacity: 0.8,
    })
    cube1 = new THREE.Mesh(geometry, material)
    cube1.position.z = -6
    cube1.position.y = -5
    scene.add(cube1)

    geometry = new THREE.BoxGeometry(5, 5, 5)
    const material2 = new THREE.MeshNormalMaterial()
    cube2 = new THREE.Mesh(geometry, material2)
    cube2.position.z = 6
    cube2.position.y = -5
    scene.add(cube2)

    let planeGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50)
    material = new THREE.MeshBasicMaterial({ color: 0xa6f995, wireframe: true })
    plane = new THREE.Mesh(planeGeometry, material)
    plane.rotation.x = Math.PI / 2
    plane.position.y = -100
    scene.add(plane)
  }

  createObjects()

  const createShadeCube = () => {
    const geometry = new THREE.BoxGeometry(5, 5, 5)
    const material2 = new THREE.MeshDepthMaterial({ displacementScale: 0.1 })
    cube3 = new THREE.Mesh(geometry, material2)
    cube3.position.z = 0
    cube3.position.y = -5
    scene.add(cube3)
  }

  createShadeCube()

  let cylinder: any
  let sphere: any

  let ADD2 = 0.02

  const createLines = () => {
    // let material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 })

    // let material = new THREE.LineDashedMaterial({
    //   color: 0xffff50,
    //   linewidth: 0.1,
    //   scale: 0.1,
    //   dashSize: 0.1,
    //   gapSize: 0.1,
    // })

    let material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 })

    let geometry = new THREE.CylinderGeometry(3, 2, 4)
    // cylinder = new THREE.Line(geometry, material)
    cylinder = new THREE.Points(geometry, material)
    cylinder.position.z = 10
    cylinder.position.x = -5

    let geometry2 = new THREE.SphereGeometry(3, 30, 30)
    // sphere = new THREE.Line(geometry2, material)
    sphere = new THREE.Points(geometry2, material)

    sphere.position.z = 10
    sphere.position.x = 5

    scene.add(cylinder)
    scene.add(sphere)
  }

  createLines()

  const axes = new THREE.AxesHelper(3)
  scene.add(axes)

  const mainLoop = () => {
    if (isMounted) {
      cube1.position.x += ADD
      cube2.position.x -= ADD
      cube3.position.z -= ADD * 3

      cylinder.rotation.x += ADD2
      sphere.rotation.x += ADD2

      cylinder.rotation.y += ADD2
      sphere.rotation.y += ADD2

      if (cube1.position.x <= -6 || cube1.position.x >= 6) {
        ADD *= -1
      }

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
