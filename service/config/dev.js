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
      "66e75844.r10.cpolar.top",
    ],
    // 代理
    proxy: {
      "/ham/backend": {
        target: "http://127.0.0.1:9999",
        changeOrigin: true,
        ws: true,
      },
    },
    client: {
      logging: "error",
      overlay: false,
    },
  },

  //仅显示错误
  stats: "errors-only",
  //用于基础设施水平的日志选项。
  infrastructureLogging: {
    level: "error",
    appendOnly: true,
  },
});
