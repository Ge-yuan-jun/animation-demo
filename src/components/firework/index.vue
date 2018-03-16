<template lang="jade">
  div.canvas-wrap
    canvas#canvas(ref="canvas")
      | 你的浏览器居然不支持 canvas ？ 赶紧换一个吧！！
</template>

<style>
#canvas { border: 1px solid #aaa; display: block; margin: 50px auto; }
</style>

<script>
export default {
  data () {
    return {
      canvas: '',
      x: 0,
      y: 0,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      alpha: Math.random(),
      color: 25,
      lineWidth: Math.random() * 4
    }
  },
  methods: {
    canvasSetting () {
      const canvas = this.$refs.canvas
      canvas.width = 800
      canvas.height = 600

      const ctx = canvas.getContext('2d')
      const W = 800
      const H = 600
      const CX = 400

      /***** Particle *********/
      const Particle = function (x, y, vx, vy) {
        this.x = x
        this.y = y
        this.ox = x
        this.oy = y
        this.vx = vx
        this.vy = vy
        this.alpha = Math.random()
        this.color = 25
        this.lineWidth = Math.random() * 4
      }

      Particle.prototype = {
        constructor: Particle,
        update: function () {
          this.vx += Math.random() * 0.5 - 0.25
          this.vy += 0.8
          this.vy *= 0.98
          this.alpha *= 0.95

          this.ox = this.x
          this.oy = this.y
          this.x += this.vx
          this.y += this.vy

          if (this.y < 0 || this.y > H || this.alpha < 0.1) {
            this.vx = Math.random() * 2 - 1
            this.vy = Math.random() * -50
            this.ox = this.x = CX
            this.oy = this.y = H
            this.alpha = Math.random()
          }
        },
        render: function (ctx) {
          ctx.save()
          ctx.globalAlpha = 0.98
          ctx.lineWidth = this.lineWidth
          ctx.strokeStyle = 'hsla(' + (this.color) + ', 100%, 50%, ' + this.alpha + ')'
          ctx.beginPath()
          ctx.moveTo(this.ox, this.oy)
          ctx.lineTo(this.x, this.y)
          ctx.stroke()
          ctx.restore()
        }
      }

      var particleCount = 500
      var particle = null
      var particles = []

      for (var i = 0; i < 250; i++) {
        particle = new Particle(
          CX,
          H,
          Math.random() * 2 - 1,
          Math.random() * -50
        )
        particles.push(particle)
      }

      requestAnimationFrame(function loop () {
        requestAnimationFrame(loop)

        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.fillRect(0, 0, W, H)

        ctx.globalCompositeOperation = 'lighter'

        if (particles.length < particleCount) {
          particle = new Particle(
            CX,
            H,
            Math.random() * 2 - 1,
            Math.random() * -50
          )
          particles.push(particle)
        }

        for (var i = 0, len = particles.length; i < len; i++) {
          particle = particles[i]
          particle.update()
          particle.render(ctx)
        }
      })
    }
  },
  mounted () {
    this.canvasSetting()
  }
}
</script>
