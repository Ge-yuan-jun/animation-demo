import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import * as THREE from 'three'
import OBJLoader from 'three-obj-loader'
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
  THREE: any

  init () {
    const OrbitControls = ThreeOrbit(THREE)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )

    const renderer = new THREE.WebGLRenderer()

    const container = <HTMLElement>this.$refs.container

    renderer.setSize( window.innerWidth, window.innerHeight )

    container.appendChild( renderer.domElement )
    camera.position.z = 5

    // 添加光源，使材质展现出来
    const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0)
    keyLight.position.set(-100, 0, 100)

    const fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75)
    fillLight.position.set(100, 0, 100)

    const backLight = new THREE.DirectionalLight(0xffffff, 1.0)
    backLight.position.set(100, 0, -100).normalize()

    scene.add(keyLight)
    scene.add(fillLight)
    scene.add(backLight)

    OBJLoader(THREE)
    this.THREE = THREE
    const ObjLoader = new this.THREE.OBJLoader()

    ObjLoader.load(
      require('./model/male02.obj'),
      function (object) {
        scene.add(object)
      },
      function (xhr) {
        console.log( xhr.loaded / xhr.total * 100 + '% loaded')
      },
      function (error) {
        console.warn('An error happened')
      }
    )

    const animate = function () {
      requestAnimationFrame( animate )
      renderer.render(scene, camera)
    }

    animate()
  }

  mounted () {
    this.init()
  }
}
