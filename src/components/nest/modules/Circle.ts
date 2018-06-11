/**
 * 生成圆点的类
 */
class Circle {
  x: number
  y: number
  r: number
  speedX: number
  speedY: number
  color: string

  /**
   * 创建一个圆点对象
   * @param r 圆的半径
   * @param x 圆心 x 轴位置
   * @param y 圆心 y 轴位置
   * @param speedX x轴方向运动速度
   * @param speedY y轴方向运动素服
   * @param color 圆点的色值
   */
  constructor (r, x, y, speedX, speedY, color) {
    this.r = r
    this.x = x < this.r ? this.r : x
    this.y = y < this.r ? this.r : y
    this.speedX = speedX > 2 ? speedX : -speedX
    this.speedY = speedY > 2 ? speedY : -speedY
    this.color = color ? color : 'orange'
  }

  drawCircle (ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
  }

  circleMove (canvas) {
    this.x += this.speedX
    if (this.x > canvas.width - this.r) {
      this.x = this.r
    } else if (this.x < this.r) {
      this.x = canvas.width - this.r
    }

    this.y += this.speedY
    if (this.y > canvas.height - this.r) {
      this.y = this.r
    } else if (this.y < this.r) {
      this.y = canvas.height - this.r
    }
  }

  /**
   * 画线
   * @param ctx canvas对象的 2d 画布
   * @param allRound 所有的点的集合
   */
  drawLine (ctx, _circle) {
    // 两点之间线的长度
    const dx = this.x - _circle.x
    const dy = this.y - _circle.y
    const l = Math.sqrt(dx * dx + dy * dy)
    const C = 1 / l * 7 - 0.009
    const o = C > 0.03 ? 0.03 : C

    ctx.strokeStyle = 'rgba(0, 0, 0, ' + o + ')'

    if (l > 250 && l < 500) {
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(_circle.x, _circle.y)
      ctx.closePath()
      ctx.stroke()
    }
  }
}

export default Circle
