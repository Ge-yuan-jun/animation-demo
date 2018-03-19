import Vue from 'Vue'
import { Component } from 'vue-property-decorator'

import * as THREE from 'three'

import { init as fireworkInit, update as fireworkUpdate } from './modules/firework'

/**
 * three.js 烟花效果
 */
@Component({})
export default class Firework extends Vue {
  firewrokSetting () {
    // -- stage 动画放置区域
    const stage = document.querySelector('.wrapper')

    // -- Scene
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x333333, 0.001)

    // -- Camera
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 5000 )
    camera.position.set(0, 0, 5)

    // -- 初始化烟花
    fireworkInit(scene)

    const renderer = new THREE.WebGLRenderer({
      alpha: true
    })
    renderer.setClearColor(0x000000)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize( window.innerWidth, window.innerHeight )
    stage.appendChild( renderer.domElement )

    // 烟花爆炸效果
    const fps = 30
    let now
    let then = Date.now()
    const interval = 1000 / fps
    let delta

    /**
     * 初始化渲染烟花
     */
    function render () {
      fireworkUpdate()
      renderer.clear()
      renderer.render(scene, camera)
    }

    /**
     * 渲染烟花爆炸动效
     */
    function animate () {
      now = Date.now()
      delta = now - then
      if (delta > interval) {
        then = now - (delta % interval)
        render()
      }
      requestAnimationFrame(animate)
    }

    animate()
  }

  mounted () {
    this.firewrokSetting()
  }
}
