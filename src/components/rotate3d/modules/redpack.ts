/*
 * @Author: Ge.Yuanjun
 * @Date: 2018-03-22 11:42:08
 * @Last Modified by: Ge.Yuanjun
 * @Last Modified time: 2018-03-22 15:44:45
 */

import * as THREE from 'three'

import TWEEN from '@tweenjs/tween.js'

/**
 * 创建红包绕身的效果
 * @param  THREE.scene $scene -- threejs 场景
 */
function createRedPacket ($scene) {
  const scene = $scene
  const loader = new THREE.TextureLoader()
  const GroupRedpack = new THREE.Group()
  GroupRedpack.name = 'G_redpack'

  loader.load(require('../assets/redpack.png'), texture => {
    const geom = new THREE.PlaneGeometry(126, 180)
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 400, 0))
    const material = new THREE.MeshLambertMaterial({ map: texture })
    material.transparent = true
    const mesh = new THREE.Mesh(geom, material)
    mesh.name = name || 'redpack'

    for (let i = 0; i< 12; i++) {
      const m = mesh.clone()
      m.name = 'redpack_' + i
      m.rotation.set(0, 0, Math.PI * i / 6)
      m.scale.set(0.22, 0.22, 0.22)
      GroupRedpack.add(m)
    }

    GroupRedpack.position.set(-180, -70, -320)
    GroupRedpack.rotation.set(-1, -0.1, 0)

    // new TWEEN.Tween(GroupRedpack.rotation)
    //   .to({ z: Math.PI * 2 }, 12000)
    //   .easing(TWEEN.Easing.Linear.None)
    //   .repeat(Infinity)
    //   .start()

    scene.add(GroupRedpack)
  })
}

export default function ($scene) {
  createRedPacket($scene)
}
