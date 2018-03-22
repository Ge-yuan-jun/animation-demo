/*
 * @Author: Ge.Yuanjun
 * @Date: 2018-03-21 11:54:29
 * @Last Modified by: Ge.Yuanjun
 * @Last Modified time: 2018-03-22 11:19:40
 */

import * as THREE from 'three'

import TWEEN from '@tweenjs/tween.js'

/**
 * 创建22
 * @param  THREE.scene $scene -- threejs场景
 */
function createCharacter ($scene) {
  const scene = $scene
  const loader = new THREE.TextureLoader()
  loader.load(require('../assets/c22.png'), texture => {
    const geom = new THREE.PlaneGeometry(1024, 1024)
    const material = new THREE.MeshLambertMaterial({ map: texture })
    material.alphaTest = 0.5
    material.transparent = true

    const mesh = new THREE.Mesh(geom, material)
    mesh.name = name || '22'
    mesh.position.set(-230, -20, -320)
    mesh.scale.set(0.40, 0.43, 0.40)

    new TWEEN.Tween(mesh.position)
      .to({y: -28}, 3600)
      .easing(TWEEN.Easing.Cubic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start()

    scene.add(mesh)
  })
}

/**
 * 创建灯光，打亮22
 * @param  THREE.scene $scene -- threejs场景
 */
function createCharacterLight ($scene) {
  const scene = $scene

  const L22 = lightSetting({
    name: '22',
    position: {
      x: 0,
      y: 400,
      z: 0
    },
    penumbra: 0.02,
    intensity: 1.6,
    distance: 1000
  })

  scene.add(L22)
}

/**
 * threejs 灯源设置
 * @param object opt -- 灯源配置信息
 */
function lightSetting (opt) {
  // options
  opt = opt || {}
  opt.name = opt.name || 'spotlight'
  opt.position = opt.position || {
    x: 0,
    y: 0,
    z: 0
  }
  opt.intensity = opt.intensity || 1
  opt.distance = opt.distance || 100
  opt.color = opt.color || 0xffffff
  opt.penumbra = opt.penumbra || 0

  // light
  const light = new THREE.SpotLight(opt.color)
  light.position.set(opt.position.x, opt.position.y, opt.position.z)
  light.name = opt.name
  light.penumbra = opt.penumbra
  light.intensity = opt.intensity
  light.distance = opt.distance

  return light
}

/**
 * 创建环境灯光
 * @param  THREE.scene $scene -- threejs 场景
 */
function createEnvLight ($scene) {
  const scene = $scene
  const envLight = new THREE.DirectionalLight(0xffffff, 0.0)
  envLight.position.set(0, 0, 500)
  envLight.name = 'ENV_LIGHT'

  new TWEEN.Tween(envLight)
    .to({ intensity: 0.5 }, 4800)
    .start()

  scene.add(envLight)
}

export default function ($scene) {
  createCharacter($scene)
  createCharacterLight($scene)
  createEnvLight($scene)
}
