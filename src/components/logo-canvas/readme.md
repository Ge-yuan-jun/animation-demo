# 利用 canvas “磨”出一个 logo

![logo-1](https://github.com/Ge-yuan-jun/animation-demo/blob/master/static/logo-1.png)

![logo-2](https://github.com/Ge-yuan-jun/animation-demo/blob/master/static/logo-2.png)

![logo-3](https://github.com/Ge-yuan-jun/animation-demo/blob/master/static/logo-3.png)

### 从 loading 动效入手

目前工作中主要负责活动页的前端 UI 展示。在活动页面的制作过程中，发现其与平常的功能页面存在一些不同点：

1. 重 UI 展示，轻逻辑
2. 设计资源多，尤其是图片、视频这类的静态资源
3. 活动页面的 UI 设计基本不可复用

针对静态资源多这一特点，最常见的做法就是预加载，先加载第一页所有的静态资源。这样做的坏处就是页面 loading 的时间会变长。如果采用一个单调的“菊花”图案展示给用户，会让时间显得更加漫长，所以资源加载期间的 loading 动画成了我们一个动脑筋的地方。

首先，loading 动画不需要请求太大的静态资源。其次，loading 动画最好跟公司品牌有一定的连续性，比如，我们公司的小电视以及“bilibili”。最后，loading 动画要足够的炫，这样，才能吸引住用户的眼球，保证留存率。

我们选择了在 logo 上面做文章。技术选型为 canvas，采用 vue 框架，静态资源选择了一张 6kb 的 logo 图片，格式为 png（注意：一定要 png 透明图片，这个在下面会解释）。由于业务的原因，动画只在 web 平台展示。

### 效果分析

最开始的三张图展示了三个阶段的效果，看上去挺复杂的。但是如果从代码层面来看的话，我们需要实现的是：

1. “bilibili” 从左到右匀速展示
2. “磨”的火花四射

对于第一个，思路其实很简单，利用 canvas 读取图片的像素点，一次展示图片一列的像素点。

对于第二个，需要解决的问题就有点多了。首先，每一粒火花出发点的定位。其次，每一粒火花的运动轨迹变化。最后，火花的颜色变化，每一个火花从头到尾会有一个颜色的过渡。

### logo的展示

首先，在 HTML 结构中，新增一个 canvas。

```html
  <div class="page-loading-wrapper">
    <canvas id="load-canvas">
      对不起，您的版本不支持 canvas， 请更新活更换浏览器再访问
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

接下来，就是最基本的响应式属性定义

```javascript
data () {
  return {
    canvas: {}, // canvas DOM
    context: {}, // canvas 画布
    cwidth: 0, // canvas 的宽度
    cheight: 0, // canvas 的高度
    text: {}, // Text 类的实例，主要是利用这个类来实现 logo 的展示
    particles: [] // “磨”出来的火花数组
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

上文中，有一个 Text 类，这个类是展示 logo 的关键，接下来，我们就来分析一下怎么写这个 Text 类。


