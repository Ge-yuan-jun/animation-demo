const path = require('path')
const webpack = require('webpack')
const utils = require('./utils/utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const preLoaders = require('./pre-loaders.conf')
const ecoDev = process.argv.includes('--eco-mode')

const linkFolders = [
  'src',
  'test',
  'node_modules/@blink-common',
  'node_modules/@blink-live',
  'node_modules/@blink-vc',
  'node_modules/@blink-canvas',
  'node_modules/@bilibili-live'
].map(resolve)

const srcFolders = ['src', 'test'].map(resolve)

module.exports = {
  cache: true,

  entry: {
    app: config.base.app,
  },

  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },

  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': resolve('src')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: srcFolders
      },
      {
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: require('./tslint.config')
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.js$/,
        use: preLoaders.concat([
          'babel-loader'
        ]),
        include: linkFolders
      },
      {
        test: /\.tsx?$/,
        use: preLoaders.concat([
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { happyPackMode: !ecoDev }
          }
        ]),
        include: srcFolders
      },
      {
        test: /\.obj?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 5120,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 1,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 5120,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /zh-cn/
    )
  ]
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
