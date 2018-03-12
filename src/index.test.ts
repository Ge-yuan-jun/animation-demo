import VueRouter from 'vue-router'
import { router, root } from './index'

describe('src/index.ts 测试.', function () {
  test('router 应该成功建立.', () => {
    expect(router instanceof VueRouter).toBe(true)
  })

  test('root 应该成功创建.', () => {
    expect(root.isTesting).toBe(true)
  })
})
