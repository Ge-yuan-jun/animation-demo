const moment = require('moment')

const config = require('./')
const packageJSON = require('../package.json')

// 基础变量.
// 这里的变量将被所有环境共享.
const base = {
  // 程序名称.
  APPNAME: JSON.stringify('webgl'),

  // 构建时间.
  BUILD_TIME: JSON.stringify(moment().format('YYYY.MM.DD - HH:mm:ss')),

  // 是否为 inject 模式.
  INJECT: JSON.stringify(config.base.inject),

  // NODE_ENV.
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),

  // 静态资源版本号.
  STATIC_VERSION: JSON.stringify(randomStr()),

  // 程序版本.
  VERSION: JSON.stringify(packageJSON.version),

  // Vue 环境.
  VUE_ENV: JSON.stringify('client')
}

let extra = {}

switch (process.env.NODE_ENV) {
  case 'development':
    extra = {
      DEV: JSON.stringify('true')
    }
    break

  case 'production':
    extra = {
      DEV: JSON.stringify('false')
    }
    break

  case 'testing':
    extra = {
      DEV: JSON.stringify('false')
    }
    break
}

module.exports = Object.assign({}, base, extra)

/**
 * 随机字符串生成函数.
 * @return {string}
 */
function randomStr () {
  return Math.floor(Math.random() * 100000 * Date.now()).toString(16)
}
