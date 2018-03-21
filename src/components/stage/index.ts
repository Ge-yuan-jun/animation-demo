import Vue from 'Vue'
import { Component } from 'vue-property-decorator'

import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

import $SATEG from './modules/index'

/**
 * three.js 背景图以及烟雾效果
 */
@Component({})
export default class Smoke extends Vue {
  stageInit () {
    // -- stage 动画放置区域
    const stage = document.querySelector('.stage-wrapper')

    // -- Scene
    const scene = new THREE.Scene()

    // -- Camera
    const camera = new THREE.PerspectiveCamera( 70, 1920/1080, 0.1, 5000 )
    camera.position.set(0, 0, -300)
    $SATEG(scene)

    new TWEEN.Tween(camera.position)
      .to({ z: 0 }, 7200)
      .start()

    const renderer = new THREE.WebGLRenderer({
      alpha: true
    })
    renderer.setClearColor(0x000000)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize( 1920, 996 )
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
      TWEEN.update()

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
    this.stageInit()
  }
}
