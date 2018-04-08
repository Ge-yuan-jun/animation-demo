import Particles from './particles'
/**
 * 读取图片的数据
 */

export default class Text {
  private tcanvas: any
  private tcontext: any
  private base: any
  private data: any
  private delay: number
  private baseDelay: number
  private index: number
  private x: number
  private y: number
  private clear: boolean = false

  constructor () {
    this.tcanvas = document.createElement('canvas')
    this.tcontext = this.tcanvas.getContext('2d')
    this.delay = 1
    this.index = 0
    this.baseDelay = this.delay
  }

  public init (w: number, h: number, src: string): any {
    return new Promise((resolve, reject) => {
      this.base = new Image()
      this.base.crossOrigin = ''

      this.base.onload = () => {
        this.x = w * 0.5 - this.base.width * 0.5
        this.y = h * 0.5 - this.base.height * 0.5

        this.tcanvas.width = this.base.width
        this.tcanvas.height = this.base.height

        this.tcontext.drawImage(this.base, 0, 0)
        this.data = this.tcontext.getImageData(0, 0, this.base.width, this.base.height)
        resolve()
      }

      this.base.onerror = () => {
        reject(new Error(`Could not load image at '../assets/${src}'`))
      }

      this.base.src = require(`../assets/${src}`)
    })
  }

  public update (particles: any[]): any {
    if (this.index >= this.base.width) {
      return
    }
    // 重置 canvas 获取的图片颜色，会消耗性能
    const data = this.data.data
    for (let i = this.index; i < this.index + 4; i++) {
      for (let j = i * 4; j < data.length; j += (4 * this.data.width)) {
        const bitmap = data[j] + data[j + 1] + data[j + 2] + data[j + 3] // R:0 G:0 B:0 A:225 -> 无图像

        if (bitmap > 255) {
          // 可直接写死图片的颜色
          // data[j] = 220
          // data[j + 1] = 220
          // data[j + 2] = 220
          // data[j + 3] = 200
          if (Math.random() > 0.98 && i < this.index + 3) {
            const x = this.x + i
            const y = this.y + (j / this.base.width / 4)
            Math.random() > 0.5 && particles.push(new Particles({x, y}))
          }
        }
      }
    }

    if (this.delay-- < 0) {
      this.index += 4
      this.delay += this.baseDelay
    }
  }

  public render (ctx): void {
    if (!this.clear) {
      this.tcontext.clearRect(0, 0, this.tcanvas.width, this.tcanvas.height)
      this.clear = true
    }

    this.index += 4

    this.tcontext.putImageData(this.data, 0, 0, 0, 0, this.index, this.base.height)
    ctx.drawImage(this.tcanvas, this.x, this.y)
  }
}
