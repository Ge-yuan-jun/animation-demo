<template lang="pug">
  <canvas id="myCanvas"></canvas>
</template>

<script>
//获取窗口宽高
const width = window.innerWidth
const height = window.innerHeight
const maxLen = Math.sqrt(width * width + height * height)

const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

//设置画布宽高与窗口宽高一样
canvas.width = width
canvas.height = height

//随机数函数
function fnRandom (min, max) {
  return parseInt((max - min) * Math.random() + min + 1)
}

function Round () {
  this.r = fnRandom(10, 30)
  this.diam = this.r * 2

  //随机位置
  const x = fnRandom(0, canvas.width - this.r)
  this.x = x < this.r ? this.r : x
  const y = fnRandom(0, canvas.height - this.r)
  this.y = y < this.r ? this.r : y
  //随机速度
  const speed = fnRandom(2, 4) / 10
  this.speedX = fnRandom(0, 4) > 2 ? speed : -speed
  this.speedY = fnRandom(0, 4) > 2 ? speed : -speed
  //颜色
  this.color = 'orange'
}

Round.prototype.draw = function () {
  //绘制函数
  ctx.fillStyle = this.color
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()
}
Round.prototype.move = function () {
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

//使用Round
const allRound = []
function initRound () {
  //初始化30个圆形对象,放到数组中
  for (let i = 0; i < 30; i++) {
    let obj = new Round()
    obj.draw()
    obj.move()
    allRound.push(obj)
  }
}
initRound()

const dxdy = []
function roundMove () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  //遍历所有的圆形对象,让对象自己重绘,移动
  for (let i = 0; i < allRound.length; i++) {
    const round = allRound[i]
    round.draw()
    round.move()
    dxdy[i] = {
      dx: round.x,
      dy: round.y
    }

    const dx = dxdy[i].dx
    const dy = dxdy[i].dy
    for (let j = 0; j < i; j++) {
      const sx = dxdy[j].dx
      const sy = dxdy[j].dy

      // 两点之间线的长度
      const l = Math.sqrt((dx - sx) * (dx - sx) + (dy - sy) * (dy - sy))
      const C = 1 / l * 7 - 0.009
      const o = C > 0.03 ? 0.03 : C

      ctx.strokeStyle = 'rgba(0, 0, 0, ' + o + ')'

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.moveTo(dxdy[i].dx, dxdy[i].dy)
      ctx.lineTo(dxdy[j].dx, dxdy[j].dy)
      ctx.closePath()
      ctx.stroke()
    }
  }
  window.requestAnimationFrame(roundMove)
}
roundMove()
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  overflow: hidden;
}
#myCanvas {
  border: 1px;
  background-color: lavenderblush;
}
.a {
  text-align: center;
  font-weight: bold;
  font-size: 17px;
  color: #787878;
  font-family: "Comic Sans MS", cursive;
}
.tou {
  font-size: 14px;
  text-align: center;
  color: #787878;
  font-family: "Comic Sans MS", cursive;
}
</style>
