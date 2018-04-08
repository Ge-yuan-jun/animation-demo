/*
 *  Dev Router Define By LancerComet at 16:37, 2016/7/15.
 *  # Carry Your World #
 *  ---
 *  开发服务器路由定义.
 *  功能基于 http-proxy-middleware, 文档详见 https://github.com/chimurai/http-proxy-middleware
 *
 *  使用方法：
 *  ---
 *  请整段复制下来，将字段更换为自己需要的路由即可。
 *
 */
'use strict'

class DirectProxy {
  constructor (url = '') {
    this.target = url
    this.changeOrigin = true
  }
}

const config = {}

// 匹配固定规则.
const proxyURLS = [
  // '/url-that-needs-to-be-proxyed'
]

// 目标不匹配的特例.
const specialRoles = [
  // { origin: '/i/api/liveinfo', target: '/IApI/liveinfo' }
]

// 批量匹配.
const wideProxy = []

// 自定义匹配.
const customProxy = {
  // '/i/**': {
  //   target: 'http://live.bilibili.com',
  //   changeOrigin: true
  // }
}

proxyURLS.forEach(url => {
  config[url] = new DirectProxy(url)
})

specialRoles.forEach(item => {
  config[item.origin] = new DirectProxy(item.target)
})

wideProxy.forEach(item => {
  config[item] = new DirectProxy()
})

Object.keys(customProxy).forEach(context => {
  config[context] = customProxy[context]
})

module.exports = config
