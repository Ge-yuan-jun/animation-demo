<template lang="jade">
  div.page-loading-wrapper
    canvas#load-canvas
      | 对不起，您的版本不支持 canvas， 请更新活更换浏览器再访问
</template>

<style lang="stylus">
.page-loading-wrapper
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 2000
  #load-canvas
    width: 100%
    height: auto
</style>

<script>
import Text from './modules/text'

export default {
  data () {
    return {
      canvas: {},
      context: {},
      cwidth: 0,
      cheight: 0,
      text: {},
      particles: []
    }
  },
  methods: {
    loop () {
      this.render()
      this.update()
      // window.setTimeout(this.loop, 1500)
      window.requestAnimationFrame(this.loop)
    },
    update () {
      this.text.update(this.particles)
      this.particles.forEach(p => p.update())
    },
    render () {
      this.context.globalCompositeOperation = 'source-over'
      this.context.globalAlpha = 1
      this.context.fillStyle = '#000000'
      this.context.fillRect(0, 0, this.cwidth, this.cheight)
      this.text.render(this.context)
      this.particles.forEach(p => p.render(this.context))
    },
    animation () {
      window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60)
        }
    }
  },
  created () {
    this.animation()
  },
  mounted () {
    this.canvas = document.getElementById('load-canvas')
    this.context = this.canvas.getContext('2d')
    this.cwidth = window.innerWidth * (window.devicePixelRatio > 1 ? 1.2 : 1)
    this.cheight = window.innerHeight * (window.devicePixelRatio > 1 ? 1.2 : 1)
    this.canvas.width = this.cwidth
    this.canvas.height = this.cheight

    this.text = new Text()
    this.text.init(this.cwidth, this.cheight, 'bilibili-logo.png').then(() => {
      this.loop()
    }).catch((err) => {
      console.log(err)
    })
  }
}
</script>
