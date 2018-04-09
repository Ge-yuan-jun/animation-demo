# 利用 canvas “磨”出一个 logo

![logo-1](https://github.com/Ge-yuan-jun/animation-demo/blob/master/static/logo-1.png)

![logo-2](https://github.com/Ge-yuan-jun/animation-demo/blob/master/static/logo-2.png)

![logo-3](https://github.com/Ge-yuan-jun/animation-demo/blob/master/static/logo-3.png)

[本文的代码](https://github.com/Ge-yuan-jun/animation-demo/tree/master/src/components/logo-canvas)

### 从 loading 动效入手

目前工作中主要负责活动页的前端 UI 展示。在活动页面的制作过程中，发现其与平常的功能页面存在一些不同点：

1. 重 UI 展示，轻逻辑
2. 设计资源多，尤其是图片、视频这类的静态资源
3. 活动页面的 UI 设计基本不可复用

针对静态资源多这一特点，最常见的做法就是预加载，先加载第一页所有的静态资源。这样做的坏处就是页面 loading 的时间会变长。如果采用一个单调的“菊花”图案展示给用户，会让时间显得更加漫长，所以资源加载期间的 loading 动画成了我们一个动脑筋的地方。

首先，loading 动画不能请求太大的静态资源。其次，loading 动画最好跟公司品牌有一定的连续性，比如，公司的小电视以及“bilibili”。最后，loading 动画要足够的炫，这样，才能吸引住用户的眼球，保证留存率。

我们选择了在 logo 上面做文章，打算基于现有的技术框架 vue ，结合 canvas，做一些好玩的事情。由于时间原因，我们没有手动绘制 logo， 而是选择了一张 6kb 的 logo 图片，格式为 png（注意：一定要 png 透明图片，这个在下面会解释），读取图片，然后绘制动画。由于业务的原因，动画只在 web 平台展示。

### 效果分析

最开始的三张图展示了三个阶段的效果，看上去挺复杂的。但是如果从代码层面来看的话，我们需要实现的是：

1. “bilibili” 从左到右匀速展示
2. “磨”的火花四射

对于第一个，思路其实很简单，利用 canvas 读取图片的像素点，每次多展示图片一列的像素点。

对于第二个，需要解决的问题就有点多了。首先，每一粒火花出发点的定位。其次，每一粒火花的运动轨迹变化。最后，火花的颜色变化，每一个火花从头到尾会有一个颜色的过渡。

### logo的展示动画

首先，在 HTML 结构中，新增一个 canvas。

```html
  <div class="page-loading-wrapper">
    <canvas id="load-canvas">
      对不起，您的版本不支持 canvas， 请更新或更换浏览器再访问
    </canvas>
  </div>
```

以及对应的样式

```css
.page-loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
}

.page-loading-wrapper #load-canvas {
  width: 100%
  height: auto
}
```

接着定义最基本的响应式数据

```javascript
data () {
  return {
    canvas: {}, // canvas DOM
    context: {}, // canvas 画布
    cwidth: 0, // canvas 的宽度
    cheight: 0, // canvas 的高度
    text: {}, // Text 类的实例，主要是利用这个类来实现 logo 的展示
  }
}
```

初始化设置 canvas，获取图片的数据

```javascript
// 挂载时即获取图片的数据
mounted () {
  // 获取 canvas 画布
  this.canvas = document.getElementById('load-canvas')
  this.context = this.canvas.getContext('2d')

  // 设置 canvas 的大小
  this.cwidth = window.innerWidth
  this.cheight = window.innerHeight
  this.canvas.width = this.cwidth
  this.canvas.height = this.cheight

  /**
   * new Text 实例，这个实例是 canvas 展示 logo 的关键
   * 下文会有对这个实例的分析
   * */
  this.text = new Text()
  this.text.init(this.cwidth, this.cheight, 'bilibili-logo.png')
    .then(() => {
      this.loop()
    }).catch((err) => {
      console.log(err)
    })
}
```

上文中，有一个 Text 类，这个类是展示 logo 的关键，这个类主要实现了：

1. 获取图片的数据方法`init`
2. 提供 logo 渲染的方法`render`

对于`init`方法：

1. 需要返回一个 Promise，这样在读取完图片的数据之后，调用方可以链式调用自己定义的方法。
2. 读取的图片数据需要有一个地方存储，方便接下来的内部操作。

对于图片数据存储，有多种方法。我们采取的做法是利用一个 canvas 来存储数据，调用方需要图片数据时，可以直接调用 canvas API 获取。

具体的代码示例：

```javascript
// this.tcontext 为 Text 类内部的 canvas 2d 画布
this.tcontext.putImageData(this.data, 0, 0, 0, 0, this.index + 1, this.base.height)

// ctx 为调用方 canvas 2d 画布
ctx.drawImage(this.tcanvas, this.x, this.y)
```

好了，接下来，具体看看 Text 类的实现。

#### Text 类的实现

先在 Text 类内定义私有属性。

```typescript
private tcanvas: any // 内部的 canvas
private tcontext: any // 内部的 canvas 画布
private clear: boolean = false // 初始化时，标识是否清除 canvas 画布内容
private base: any // 内部 canvas 的基本属性
private x: number // logo 图片渲染的起始 x 轴值
private y: number // logo 图片渲染的起始 y 轴值
private data: any // 存储图片数据
private index: number // 渲染图片的宽度
```

初始化属性的赋值。

```typescript
constructor () {
  this.tcanvas = document.createElement('canvas')
  this.tcontext = this.tcanvas.getContext('2d')
  this.index = 0
}
```

init 方法先返回一个 Promise。

```typescript
public init (): any {
  return new Promise((resolve, reject) => {})
}
```

该方法需要传入3个参数：

1. w：外部 canvas 的宽度，类型为 number
2. h：外部 canvas 的高度，类型为 number
3. src：logo 图片的地址，类型为 string

这样，我们就可以获取图片，并在视图的正中央展示。

```typescript
public init (w: number, h: number, src: string): any {
  return new Promise((resolve, reject) => {})
}
```

添加获取图片数据以及计算 logo 图片渲染位置的代码。

```typescript
public init (w: number, h: number, src: string): any {
  return new Promise((resolve, reject) => {
    this.base = new Image()
    // 设置 crossOrigin 为 ‘’，保证 canvas 不会报图片跨域的错误
    this.base.crossOrigin = ''
    this.base.src = require(`../assets/${src}`)

    this.base.onerror = () => {
      reject(new Error(`Could not load image at '../assets/${src}'`))
    }

    this.base.onload = () => {
      // 计算 logo 图片渲染位置
      this.x = w * 0.5 - this.base.width * 0.5
      this.y = h * 0.5 - this.base.height * 0.5

      // 设置内部 canvas 的宽高与外部相同
      this.tcanvas.width = this.base.width
      this.tcanvas.height = this.base.height

      // 存储图片数据
      this.tcontext.drawImage(this.base, 0, 0)
      this.data = this.tcontext.getImageData(0, 0, this.base.width, this.base.height)
      resolve()
    }
  })
}
```

init 方法只是读取了数据，而 logo 渲染需要另一个 render 方法。

render 方法需要一个参数：

- ctx：canvas 的 2d 画布，这样就可以读取 Text 内部存储的图片数据

其次，render 函数刚调用时，需要清空内部 canvas 2d 画布的图片数据，这样才能保证渲染的动画效果。

```typescript
public render (ctx): void {
  if (!this.clear) {
    this.tcontext.clearRect(0, 0, this.tcanvas.width, this.tcanvas.height)
    this.clear = true
  }
}
```

清理完数据之后，开始渲染。渲染动画的原理就是每次渲染的宽度比之前渲染的宽度多出一定的值，这样，在一定时间内多次渲染，就会在视觉里形成动画。完整的 render 代码如下：

```typescript
public render (ctx): void {
  if (!this.clear) {
    this.tcontext.clearRect(0, 0, this.tcanvas.width, this.tcanvas.height)
    this.clear = true
  }

  // 改变每次渲染的宽度
  if (this.index < this.base.width) {
    this.index += 4
  }

  // 渲染内部的 canvas
  this.tcontext.putImageData(this.data, 0, 0, 0, 0, this.index, this.base.height)
  ctx.drawImage(this.tcanvas, this.x, this.y)
}
```

在触发 mounted 钩子函数并获取好图片数据之后，可以通过 `requestAnimationFrame` 重复调用 loop 来渲染动画。

loop函数如下：

```javascript
loop () {
  // 设置 canvas 画布
  this.context.globalCompositeOperation = 'source-over'
  this.context.globalAlpha = 1
  this.context.fillStyle = '#000000'
  this.context.fillRect(0, 0, this.cwidth, this.cheight)

  // 渲染 logo
  this.text.render(this.context)

  // 不断调用 loop 函数，以达到图片渲染的动画效果
  window.requestAnimationFrame(this.loop)
}
```

以上，就可以实现不带“火花四溅”效果的 logo 动画。

### 添加“火花四溅”效果

“火花四溅”需要分成两块，一个是单个的“火花”类 Spark，还需要一个“火花”的集合管理类 Particles。

#### Spark 类

Spark 需要对外提供三个方法：

1. update：“火花”更新方法
2. remove：“火花”移除方法
3. render：“火花”渲染方法

remove 方法最简单：

```typescript
public remove (index, array) {
  array.splice(index, 1)
}
```

删除数组中指定索引的项即可。

update 以及 render 方法比较复杂，render 主要是用来初始化渲染每一个火花，update 主要是用来更新每一个火花的运动轨迹。

完成这两个方法之前，需要先了解 Spark 的私有属性：

```typescript
/**
  * 初始化坐标
  */
private x: number
private y: number

/**
  * 速度对象值
  * direct
  * weight
  * friction
  */
private v: any

/**
  * 横向加速度对象值
  * change
  * min
  * max
  */
private a: any

/**
  * 纵向加速度对象值
  * direct
  * weight
  */
private g: any

/**
  * “火花”线条的宽度
  */
private width: number

/**
  * “火花”运动剩余时长
  */
private lifespan: number

/**
  * “火花”运动的时长
  */
private maxlife: number

/**
  * 运动轨迹中前一次点的坐标
  * x
  * y
  */
private prev: any
```

这些私有属性的初始化如下：

```typescript
constructor (options: any) {
  // 初始化火花的坐标
  this.x = options.x
  this.y = options.y

  /**
   * 初始化初始速度，横向加速度，纵向加速度
   * 每次 update 需要利用到 v,g 计算坐标点
   */
  this.v = { direct: Math.random() * Math.PI * 2, weight: Math.random() * 10 + 2, friction: 0.88 }
  this.g = { direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2), weight: Math.random() * 0.25 + 0.25 }
  this.a = { change: Math.random() * 0.4 - 0.2, min: this.v.direct - Math.PI * 0.4,
    max: this.v.direct + Math.PI * 0.4 }

  // 火花的宽度
  this.width = Math.random() * 3

  // 初始化生命周期
  this.lifespan = Math.round(Math.random() * 20 + 30)
  this.maxlife = this.lifespan

  // 初始化运动轨迹的前一个点
  this.prev = { x: this.x, y: this.y }
}
```

理解了 Spark 类的初始化，我们可以尝试完成 render 以及 update 方法了。

##### render 方法

render 方法需要利用到 canvas 的绘图 API，主要包括：

1. beginPath、closePath
2. globalAlpha
3. createLinearGradient
4. strokeStyle
5. lineWidth
6. moveTo
7. lineTo

接受一个参数 ctx，代表外部 canvas 的 2d 画布。

主要代码如下：

```typescript
public render (ctx) {
  // 已经消失，则不再绘制
  if (this.lifespan <= 0) {
    return
  }
  ctx.beginPath()
  ctx.globalAlpha = this.lifespan / this.maxlife

  /**
    * 绘制渐变区域
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
```

render 方法并不复杂，只是单纯的利用 canvas 的 API 实现一个渐变的线段。update 方法才是实现动效的关键所在。

##### update 方法

update 方法要实现以下功能：

1. 根据速度以及加速度重新计算坐标点
2. 随机化火花的运动轨迹
3. 计算火花的运动时间，超过其生命时长，则删除该节点
4. 根据实际的效果，对火花的运动做一些微调

计算坐标点的代码如下：

```javascript
// 保存运动的点
this.prev = { x: this.x, y: this.y }

/**
  * 重新计算 坐标点 (x, y)
  */
this.x += Math.cos(this.v.direct) * this.v.weight
this.x += Math.cos(this.g.direct) * this.g.weight

this.y += Math.sin(this.v.direct) * this.v.weight
this.y += Math.sin(this.g.direct) * this.g.weight
```

随机化火花的运动轨迹可以这样实现：

```javascript
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
```

想要判断是否删除节点，可以这么做：

```javascript
/**
  * 火花运动生命时长，超过一定时间，则删除该节点
  */
this.lifespan > 0 && this.lifespan--
this.lifespan <=0 && this.remove(index, array)
```

如果这么完成 update 方法，火花四溅的范围偏大，实际效果并不好，所以，做了下面的微调：

```javascript
/**
  * 缩小火花四射的范围
  */
if (this.v.weight > 0.2) {
  this.v.weight *= this.v.friction
}
```

全部的 update 方法代码如下：

```typescript
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
  this.lifespan <= 0 && this.remove(index, array)
}
```

这是单个火花效果，如果直接使用，不会出现“火花四溅”的效果。我们需要建立一个 Partciles 类来管理火花。

#### Particles 类

Particles 类需要两个私有属性：

1. max：同时可以出现火花数目
2. sparks：存放火花的数组

在初始化 Particles 类时，火花数目最好具有一定的随机性，所以 max 值尽量每次都不一样。

```typescript
constructor (options: any) {
  /**
    * 最多 10 个火花
    */
  this.max = Math.round(Math.random() * 5 + 5)
  this.sparks = []

  for (let i = 0; i < this.max; i++) {
    this.sparks.push(new Spark(options))
  }
}
```

Particles 类要实现两个功能：

1. 更新所有的火花
2. 渲染所有的火花

这两个方法很简单，都是自解释代码：

```typescript
/**
  * 更新所有的火花
  */
public update () {
  this.sparks.forEach((s, i) => s.update(i, this.sparks))
}

/**
  * 渲染所有的火花
  * @param ctx canvas - canvas 对象的 context 属性
  */
public render (ctx) {
  this.sparks.forEach(s => s.render(ctx))
}
```

#### 火花的引入

行百里者半九十，我们还要将 Spark 以及 Particles 两个类跟之前的代码相结合，实现“火花四溅”这一效果，一起来吧！

首先需要添加一个响应数据：`particles`，用来保存火花。

```javascript
data () {
  return {
    canvas: {},
    context: {},
    cwidth: 0,
    cheight: 0,
    text: {},
    particles: [] // 用来保存火花管理类 Particles
  }
}
```

由于火花生成的位置要在 logo 渲染的过程中计算，我们需将 particles 传入 Text 类内进行操作。

这就需要在 Text 类添加一个 update 方法，主要思路是遍历之前获取的图片数据，根据数据判断色值，如果色值大于 255， 说明有图像，这时候就可以添加“火花”了。最基础的代码如下：

```typescript
public update (particles: any[]): any {
  const data = this.data.data
  for (let i = this.index; i < this.index + 4; i++) {
    for (let j = i * 4; j < data.length; j += (4 * this.data.width)) {
      const bitmap = data[j] + data[j + 1] + data[j + 2] + data[j + 3] // R:0 G:0 B:0 A:255 -> 无图像
      if (bitmap > 255) {
        // 0.98 是一个参数，可随意设置，主要用来控制火花的数目
        if (Math.random() > 0.98 && i < this.index + 3) {
          const x = this.x + i
          const y = this.y + (j / this.base.width / 4)
          Math.random() > 0.5 && particles.push(new Particles({x, y}))
        }
      }
    }
  }
}
```

可以对上面这一段代码做一个优化，在函数刚开始时，判断 index 是否超过图片的宽度，如超出，则不再执行：

```typescript
if (this.index >= this.base.width) {
  return
}
```

利用 update 方法，可以初始化火花。这样，火花的 render 以及 update 可以在 loop 中调用，loop 方法修改如下：

```javascript
loop () {
  this.render()
  this.update()
  window.requestAnimationFrame(this.loop)
},
// 更新 logo 以及火花
update () {
  this.text.update(this.particles)
  this.particles.forEach(p => p.update())
},
// 渲染 logo 以及火花
render () {
  this.context.globalCompositeOperation = 'source-over'
  this.context.globalAlpha = 1
  this.context.fillStyle = '#000000'
  this.context.fillRect(0, 0, this.cwidth, this.cheight)

  this.text.render(this.context)
  this.particles.forEach(p => p.render(this.context))
}
```

这样，loading 的动画效果基本就完成了，其它还有一些可以优化的点。比如，对于 window.requestAnimationFrame 的嗅探以及兼容处理；在资源加载完成之后，停止 loading 动画的渲染等等，大家可以自行添加。
