const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const OptimizeJsPlugin = require('optimize-js-plugin')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const config = require('../config')
const env = require('../config/conf.env')
const utils = require('./utils/utils')
const baseWebpackConfig = require('./webpack.base.conf')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'vue-style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: config.build.productionSourceMap, importLoaders: 1 } },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'vue-style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: config.build.productionSourceMap, importLoaders: 1 } },
            'postcss-loader',
            { loader: 'stylus-loader', options: { sourceMap: config.build.productionSourceMap } }
          ]
        })
      },
    ]
  },

  devtool: config.build.productionSourceMap ? '#source-map' : false,

  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },

  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin(Object.assign({
      'process.env': env
    }, env)),

    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.optimize.UglifyJsPlugin(Object.assign({}, require('./uglify.conf'), {
      sourceMap: config.build.productionSourceMap
    })),

    new OptimizeJsPlugin({
      sourceMap: config.build.productionSourceMap
    }),

    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),

    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 10000
    }),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        autoprefixer: false
      }
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: config.base.template,
      inject: config.base.inject,
      minify: {
        removeComments: false,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),

    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&  // 不能去掉, 否则会毁掉代码分片.
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: Infinity
    }),

    new ForkTsCheckerWebpackPlugin({
      tsconfig: resolve('tsconfig.json'),
      logger: {
        error (error) {
          console.error('TypeScript 语法出现错误, 请在修改后重新构建.')
          console.error(error)
          process.exit(1)
        },
        warn: function (msg) {
          console.warn(msg)
        },
        info (msg) {
          console.info(msg)
        }
      }
    })
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig

function resolve (filename) {
  return path.resolve(__dirname, '../' + filename)
}
