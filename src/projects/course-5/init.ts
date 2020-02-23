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
  camera.position.z = 5

  // create the renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  var light = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(light)

  var light2 = new THREE.PointLight(0xffffff, 0.5)
  scene.add(light2)

  let ADD = 0.01

  let fragments: THREE.Mesh[] = []
  let fragments2: THREE.Mesh[] = []

  const create = (bool: boolean, ...args: [number, number, number][]) => {
    const geometry = new THREE.Geometry()

    // Create vertices
    geometry.vertices.push(new THREE.Vector3(...args[0]))
    geometry.vertices.push(new THREE.Vector3(...args[1]))
    geometry.vertices.push(new THREE.Vector3(...args[2]))

    // Create face
    geometry.faces.push(new THREE.Face3(0, 1, 2))

    // Compute normals to have acces to them
    geometry.computeFaceNormals()

    const material = new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide,
    })

    const frag = new THREE.Mesh(geometry, material)
    scene.add(frag)

    // Center geometry to have rotation axis through center
    geometry.center()

    // Create somehow offset vector
    const x = args.reduce((acc, arg) => acc + arg[0], 0)
    const y = args.reduce((acc, arg) => acc + arg[1], 0)
    const z = args.reduce((acc, arg) => acc + arg[2], 0)
    const v = new THREE.Vector3(x, y * 2, z).normalize()

    // Move frag to his position
    frag.position.addScaledVector(v, 0.7)

    bool ? fragments.push(frag) : fragments2.push(frag)
  }

  create(true, [1, 0, 1], [-1, 0, 1], [0, 1, 0])
  create(true, [-1, 0, 1], [-1, 0, -1], [0, 1, 0])
  create(true, [-1, 0, -1], [1, 0, -1], [0, 1, 0])
  create(true, [1, 0, -1], [1, 0, 1], [0, 1, 0])

  create(false, [1, 0, 1], [-1, 0, 1], [0, -1, 0])
  create(false, [-1, 0, 1], [-1, 0, -1], [0, -1, 0])
  create(false, [-1, 0, -1], [1, 0, -1], [0, -1, 0])
  create(false, [1, 0, -1], [1, 0, 1], [0, -1, 0])

  const axes = new THREE.AxesHelper(3)
  scene.add(axes)

  const rotateFrag = (frag: THREE.Mesh) => {
    const rotAxis1 = (frag.geometry as THREE.Geometry).vertices[0]
    const rotAxis2 = (frag.geometry as THREE.Geometry).vertices[1]
    const axis = new THREE.Vector3()
    axis.subVectors(rotAxis1, rotAxis2)
    frag.rotateOnAxis(axis, ADD / 5)
  }

  const moveFrag = (frag: THREE.Mesh, bool: boolean) => {
    const normal = (frag.geometry as THREE.Geometry).faces[0].normal
    frag.position.addScaledVector(normal, bool ? ADD : -ADD)
  }

  const mainLoop = () => {
    if (isMounted) {
      fragments.forEach((frag) => {
        rotateFrag(frag)
        moveFrag(frag, false)
      })

      fragments2.forEach((frag) => {
        rotateFrag(frag)
        moveFrag(frag, true)
      })

      renderer.render(scene, camera)
      requestAnimationFrame(mainLoop)
    }
  }

  mainLoop()

  return () => (isMounted = false)
}
