'use strict'

const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')

const baseWebpackConfig = require('./base')
const cssWebpackConfig = require('./css')
const config = require('../project.config')
const terserOptions = require('./terserOptions')

module.exports = merge(baseWebpackConfig, cssWebpackConfig, {
  mode: 'production',

  output: {
    publicPath: config.build.publicPath,
  },

  // 代码压缩
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(terserOptions())],
    moduleIds: 'deterministic',// 保证每次打包的文件hash值一致
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,// 匹配node_modules目录下的文件
          priority: -10,// 优先级
          chunks: 'initial',// 只打包初始时依赖的第三方
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,// 最小引用次数
          priority: -20,// 优先级
          chunks: 'initial',// 只打包初始时依赖的第三方
          reuseExistingChunk: true,// 如果当前要打包的模块和以前已经被打包的模块是同一个，就会忽略，不会再打包
        },
      },
    },
  },
})
