import Spark from './spark'

/**
 * 火花集合
 */
export default class Particles {
  private max: number
  private sparks: any[]

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

  /**
   * 更新火花
   */
  public update () {
    this.sparks.forEach((s, i) => s.update(i, this.sparks))
  }

  /**
   * 渲染火花
   * @param ctx canvas - canvas 对象的 context 属性
   */
  public render (ctx) {
    this.sparks.forEach(s => s.render(ctx))
  }
}
