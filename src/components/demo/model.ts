import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import * as THREE from 'three'
import { OBJLoader } from './modules/OBJLoader'

OBJLoader(THREE)
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
  THREE: any

  windowHalfX: number = window.innerWidth / 2
  windowHalfY: number = window.innerHeight /2

  mouseX: number = 0
  mouseY: number = 0

  init () {
    // camera
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 2000 )
    camera.position.z = 250

    // scene
    const scene = new THREE.Scene()

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xcccccc, 0.8)
    camera.add(pointLight)
    scene.add(camera)

    const ObjLoader = new this.THREE.OBJLoader()

    ObjLoader.load(
      require('./model/grave.obj'),
      function (object) {
        object.position.y = - 50
        scene.add(object)
      },
      function (xhr) {
        console.log( xhr.loaded / xhr.total * 100 + '% loaded')
      },
      function (error) {
        console.warn('An error happened')
      }
    )

    const renderer = new THREE.WebGLRenderer()

    const container = <HTMLElement>this.$refs.container

    renderer.setSize( window.innerWidth, window.innerHeight )

    container.appendChild( renderer.domElement )

    const onWindowResize = () => {
      this.windowHalfX = window.innerWidth / 2
      this.windowHalfY = window.innerHeight / 2

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const onDocumentMouseMove = (event) => {
      this.mouseX = (event.clientX - this.windowHalfX) / 2
      this.mouseY = (event.clientY - this.windowHalfY) / 2
    }

    document.addEventListener( 'mousemove', onDocumentMouseMove, false )
    window.addEventListener( 'resize', onWindowResize, false )

    const animate = () => {
      requestAnimationFrame( animate )

      // render
      camera.position.x += (this.mouseX - camera.position.x) * 0.05
      camera.position.y += (-this.mouseY - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()
  }

  mounted () {
    this.THREE = THREE
    this.init()
  }
}
