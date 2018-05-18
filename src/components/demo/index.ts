import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import * as THREE from 'three'
import ThreeOrbit from 'three-orbit-controls'

/**
 * Demo Component.
 *
 * @export
 * @class DemoComponent
 * @extends {Vue}
 */
@Component({
  components: {}
})
export default class DemoComponent extends Vue {
  init () {
    const OrbitControls = ThreeOrbit(THREE)

    console.log('objLoader', THREE.ObjectLoader)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )

    const renderer = new THREE.WebGLRenderer()

    const container = <HTMLElement>this.$refs.container

    renderer.setSize( window.innerWidth, window.innerHeight )

    container.appendChild( renderer.domElement )

    // resize 期间改变 canvas 的大小
    window.addEventListener('resize', function () {
      const height = window.innerHeight
      const width = window.innerWidth
      renderer.setSize(width, height)
      camera.aspect = width/height
      camera.updateProjectionMatrix()
    })

    const geometry = new THREE.BoxGeometry( 1, 1, 1 )

    /**
     * TextureLoader 的用法
     * 改变材质
     */
    const cubeMaterial = [
      new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(require('./assets/1.svg')),
        side: THREE.DoubleSide
      }), // right side
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(require('./assets/2.svg')),
        side: THREE.DoubleSide
      }), // left side
      new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(require('./assets/3.svg')),
        side: THREE.DoubleSide
      }), // top side
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(require('./assets/4.svg')),
        side: THREE.DoubleSide
      }), // bottom side
      new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(require('./assets/5.svg')),
        side: THREE.DoubleSide
      }), // front side
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(require('./assets/6.svg')),
        side: THREE.DoubleSide
      }) // back side
    ]

    const material = new THREE.MeshFaceMaterial( cubeMaterial )
    const cube = new THREE.Mesh( geometry, material )
    camera.position.z = 5

    const controls = new OrbitControls( camera, renderer.domElement )
    controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    // controls.dampingFactor = 0.25
    // controls.screenSpacePanning = false
    // controls.minDistance = 1
    // controls.maxDistance = 50
    controls.maxPolarAngle = Math.PI / 2 // 这个是用来标识物体可以转动的角度

    scene.add( cube )

    // 添加光源，使材质展现出来
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 5.0)
    scene.add(ambientLight)

    const animate = function () {
      requestAnimationFrame( animate )

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update()
      // cube.rotation.x += 0.01
      // cube.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    animate()
  }

  mounted () {
    this.init()
  }
}
