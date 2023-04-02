const { merge } = require('webpack-merge')

// 基础配置文件
const baseWebpackConfig = require('./base')
// css配置文件
const cssWebpackConfig = require('./css')
// 配置了端口和publicPath
const config = require('../project.config')

module.exports = merge(baseWebpackConfig, cssWebpackConfig, {
  mode: "development",

  devtool: "eval-cheap-module-source-map",

  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /./, to: "/index.html" }],
    },
    devMiddleware: {
      publicPath: config.dev.publicPath,
    },
    open: false,
    host: "127.0.0.1",
    port: config.dev.port,
    // 使用热更新而不是liveReload
    liveReload: false,
    hot: true,
    allowedHosts: [
      // cpolar内网穿透地址 http://127.0.0.1:9200/
      "77b051ab.r5.vip.cpolar.cn",
    ],
  },

  infrastructureLogging: {
    // 仅显示警告和错误
    level: "warn",
  },

  // 精确地控制 bundle 信息该怎么显示
  stats: "errors-only",
});
