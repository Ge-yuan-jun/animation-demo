/**
 * 火花效果
 */
export default class Spark {
  /**
   * 初始化坐标
   */
  private x: number
  private y: number

  /**
   * direct
   * weight
   * friction
   */
  private v: any

  /**
   * change
   * min
   * max
   */
  private a: any

  /**
   * direct
   * weight
   */
  private g: any

  private width: number

  private lifespan: number
  /**
   * 生命周期
   */
  private maxlife: number

  /**
   * 前一个点坐标
   */
  private prev: any

  constructor (options: any) {
    this.x = options.x
    this.y = options.y

    /**
     * 每次 update 需要利用到 v,g 计算坐标点
     */
    this.v = { direct: Math.random() * Math.PI * 2, weight: Math.random() * 10 + 2, friction: 0.88 }
    this.g = { direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2), weight: Math.random() * 0.25 + 0.25 }
    this.a = { change: Math.random() * 0.4 - 0.2, min: this.v.direct - Math.PI * 0.4,
      max: this.v.direct + Math.PI * 0.4 }

    this.width = Math.random() * 3

    this.lifespan = Math.round(Math.random() * 20 + 30)
    this.maxlife = this.lifespan

    this.prev = { x: this.x, y: this.y }
  }

  public update (index, array) {
    this.prev = { x: this.x, y: this.y }

    /**
     * 重新计算 坐标点 (x, y)
     */
    this.x += Math.cos(this.v.direct) * this.v.weight
    this.x += Math.cos(this.g.direct) * this.g.weight

    this.y += Math.sin(this.v.direct) * this.v.weight
    this.y += Math.sin(this.g.direct) * this.g.weight

    /**
     * 缩小火花四射的范围
     */
    if (this.v.weight > 0.2) {
      this.v.weight *= this.v.friction
    }

    /**
     * 随机话火花的轨迹
     */
    this.v.direct += this.a.change
    /**
     * 改变加速度的正负值，轨迹看起来更加随机化
     */
    if (this.v.direct > this.a.max || this.v.direct < this.a.min) {
      this.a.change *= -1
    }

    /**
     * 火花运动生命时长，超过一定时间，则删除该节点
     */
    this.lifespan > 0 && this.lifespan--
    this.lifespan <=0 && this.remove(index, array)
  }

  public remove (index, array) {
    array.splice(index, 1)
  }

  public render (ctx) {
    if (this.lifespan <= 0) {
      return
    }
    ctx.beginPath()
    ctx.globalAlpha = this.lifespan / this.maxlife

    /**
     * 绘制渐近线
     */
    const grd = ctx.createLinearGradient(this.x, this.y, this.prev.x, this.prev.y)

    grd.addColorStop(0, '#FFFFFF')
    grd.addColorStop(0.3, '#FF7F00')
    grd.addColorStop(0.7, '#F47843')
    grd.addColorStop(0.9, '#FF0000')

    ctx.strokeStyle = grd
    ctx.lineWidth = this.width

    /**
     * 到下一个点重新开始绘制
     */
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.prev.x, this.prev.y)
    ctx.stroke()
    ctx.closePath()
  }
}
