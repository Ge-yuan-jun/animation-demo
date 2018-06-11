import Circle from './Circle'

/**
 * 获取随机数
 * @param min 最小数字
 * @param max 最大数字
 */
function fnRandom (min, max): number {
  return parseInt((max - min) * Math.random() + min + 1)
}

/**
 * 画圆以及线
 */
function init (): void {
  const canvas: any = document.getElementById('myCanvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')

  const allRound = []

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < allRound.length; i++) {
      const round = allRound[i]
      round.drawCircle(ctx)
      round.circleMove(canvas)

      for (let j = 0;j < i;j++) {
        round.drawLine(ctx, allRound[j])
      }
    }
    requestAnimationFrame(draw)
  }

  const init = (num) => {
    for (let i = 0; i< num; i++) {
      const radius = fnRandom(10,30)

      const circleX = fnRandom(0, canvas.width - radius)
      const circleY = fnRandom(0, canvas.height - radius)

      const speed = fnRandom(2, 10) / 10
      const speedX = fnRandom(0, 4) > 2 ? speed : -speed
      const speedY = fnRandom(0, 4) > 2 ? speed : -speed

      const color = '#798a98'

      allRound.push(new Circle(radius, circleX, circleY, speedX, speedY, color))
    }
  }

  init(20)
  draw()
}

export {
  init
}
