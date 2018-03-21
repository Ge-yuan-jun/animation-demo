/*
 * @Author: Ge.Yuanjun
 * @Date: 2018-03-21 10:59:08
 * @Last Modified by: Ge.Yuanjun
 * @Last Modified time: 2018-03-21 14:27:06
 * @desc: 创建背景图片以及烟雾效果
 */

import * as THREE from 'three'

import TWEEN from '@tweenjs/tween.js'

const SMOKE_ASSETS = {
  background: require('../../smoke/assets/back.jpg'),
  smoke: require('../../smoke/assets/smoke.png')
}

/**
 * 创建背景图片
 * @param  THREE.Scene $scene -- three.js 创建的
 */
function createBg ($scene) {
  const scene = $scene

  // create back scene
  const geom = new THREE.PlaneGeometry(2048, 1024)
  const material = new THREE.MeshBasicMaterial({ map: SMOKE_ASSETS['background'] })
  const mesh = new THREE.Mesh(geom, material)
  mesh.name = name || 'background'
  mesh.position.set(0, 0, -670)
  scene.add(mesh)
}

/**
 * 创建 smoke 烟雾动效
 * @param  THREE.Scene $scene -- three.js 创建的
 */
function createSmoke ($scene) {
  const scene = $scene
  const geom = new THREE.PlaneGeometry(1586, 930)
  const material = new THREE.MeshBasicMaterial({ map: SMOKE_ASSETS['smoke'] })
  material.transparent = true
  material.opacity = 1

  new TWEEN.Tween({ x: 0, y: 100 })
    .to({ x: 100, y: 0 }, 12000)
    .onUpdate(function () {
      if (this._object.x <= 50) {
        material.opacity = this._object.x * 0.01
      } else {
        material.opacity = this._object.y * 0.01
      }
    })
    .repeat(Infinity)
    .start()

  const mesh = new THREE.Mesh(geom, material)
  mesh.name = name || 'smoke'

  mesh.position.set(-300, 0, -200)
  mesh.scale.set(0.4, 0.4, 0.4)

  // smoke position
  new TWEEN.Tween(mesh.position)
    .to({ x: 0, y: 100 }, 12000)
    .repeat(Infinity)
    .start()

  scene.add(mesh)
}

export default function ($scene) {
  const res = SMOKE_ASSETS
  const len = 2
  let loaded = 0
  const loader = new THREE.TextureLoader()

  // 跨域请求图片
  loader.crossOrigin = ''

  for (const r in res) {
    if (res[r]) {
      loader.load(res[r], texture => {
        SMOKE_ASSETS[r] = texture
        loaded ++
        if (loaded >= len) {
          createBg($scene)
          createSmoke($scene)
        }
      })
    }
  }
}
