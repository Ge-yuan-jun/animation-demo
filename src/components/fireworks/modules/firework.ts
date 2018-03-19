import * as THREE from 'three'

/**
 * 烟花初始化以及重置方法
 */
function firework () {
  let scene
  const tail = []
  const wings = []
  // 烟花初始化时的 Y轴 坐标
  const bottom = -1200
  let targetX = 0
  let targetY = 0
  let lastTargetX = 0
  let lastTargetY = 0
  let hitCount = 0
  const friction = []

  const atomGeom = new THREE.CircleBufferGeometry(2, 32)
  const color = {
    r: 1,
    g: 0.5,
    b: 1
  }

  // Options
  const speed = 20

  /**
   * 生成器 Generator
   */
  function Generator (target, index, opt) {
    opt = opt || {}
    const geom = atomGeom.clone()
    const material = new THREE.MeshBasicMaterial({color: 0xffffff})
    material.transparent = true
    material.opacity = index * 0.05
    const mesh = new THREE.Mesh(geom, material)
    mesh.position.set(0, bottom, 0)
    if (opt.scale) {
      mesh.scale.set(opt.scale, opt.scale, opt.scale)
    }
    mesh.name = 'f_' + index
    target.push({
      mesh,
      material,
      animate: 1,
      speed: 100,
      grv: 0,
      wind: 0,
      directionX: opt.directionX || 0,
      directionY: opt.directionY || 0
    })
    return mesh
  }

  /**
   * Create Firefork
   */
  function createFirework () {
    targetX = 100 + Math.round(Math.random() * 400)
    targetY = 150 + Math.round(Math.random() * 150)
  }

  /**
   * Reset Firework
   */
  function resetFirework () {
    hitCount = tail.length
    lastTargetX = targetX
    lastTargetY = targetY
    createFirework()

    color.r = (130 + 100 * Math.random()) / 255
    color.b = (236 - 100 * Math.random()) / 255

    tail.forEach((t, index) => {
      t.mesh.position.x = targetX
      t.mesh.position.y = bottom + 5 * (10 - index)
      t.animate = 1
    })

    wings.forEach((list, index) => {
      friction[index] = 0.05
      list.forEach(w => {
        w.mesh.position.set(lastTargetX, lastTargetY, 0)
        w.speed = 20
        w.grv = 0
        w.material.color = color
      })
    })
  }

  /**
   * Update Tail
   */
  function updateTail () {
    tail.forEach((t, index) => {
      if (t.animate) {
        if (t.mesh.position.y < targetY) {
          t.mesh.position.y += speed
        } else {
          t.mesh.position.y = bottom
          t.animate = 0
          hitCount--
        }
      }
    })
  }

  /**
   * Update Wings
   */
  function updateWings () {
    wings.forEach((list, direction) => {
      friction[direction] += (Math.random() - 0.5) * 0.005
      list.forEach((w, index) => {
        w.speed -= friction[direction] + index * 0.008
        w.grv += (Math.random() + index / 200) * 0.05
        w.wind = Math.random() * 10
        w.mesh.position.x += Math.round(w.directionX * w.speed + w.wind) * 0.1
        w.mesh.position.y += Math.round(w.directionY * w.speed) * 0.1 - w.grv
      })
    })
  }

  /**
   * Check Status
   */
  function checkStatus () {
    if (hitCount === 0) {
      resetFirework()
    }
  }

  return {
    init ($scene) {
      scene = $scene
      const group = new THREE.Group()
      group.name = 'FIREWORK'
      group.position.set(0, 0, -600)
      scene.add(group)

      // create tail 创建烟花发射时的尾巴
      for (let i = 20; i > 0; i--) {
        group.add(Generator(tail, i, {
          scale: 0.5
        }))
      }

      // create wings 创建烟花
      for (let i = 0; i < 12; i++) {
        wings.push([])
        friction.push(0.05)
        for (let j = 20; j > 0; j--) {
          group.add(Generator(wings[i], j, {
            directionX: Math.cos(Math.PI / 6 * (i + 0.6)),
            directionY: Math.sin(Math.PI / 6 * (i + 0.6))
          }))
        }
      }

      // init firework
      createFirework()
      resetFirework()
    },
    update () {
      updateTail()
      updateWings()
      checkStatus()
    }
  }
}

const { init , update  } = firework()

export  {
  init,
  update
}
