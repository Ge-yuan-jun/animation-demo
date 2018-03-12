const utils = require('./utils/utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const preLoaders = require('./pre-loaders.conf')

const cssLoaders = utils.cssLoaders({
  sourceMap: isProduction
    ? config.build.productionSourceMap
    : config.dev.cssSourceMap,
  extract: isProduction,
  esModule: true
})

const tsLoaders = {
  ts: preLoaders.concat([
    'babel-loader',
    {
      loader: 'ts-loader',
      options: {
        happyPackMode: true
      }
    },
    {
      loader: 'tslint-loader',
      options: require('./tslint.config')
    }
  ])
}

module.exports = {
  loaders: Object.assign({}, cssLoaders, tsLoaders)
}
