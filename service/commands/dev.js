"use strict";

const loadEnv = require("../utils/loadEnv");
loadEnv();
loadEnv("development");

// chalk 设置控制台颜色
const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

const { info } = require("../utils/logger");
const getLocalIP = require("../utils/getLocalIP");

// 配置文件
const devWebpackConfig = require("../config/dev");

const devServerOptions = devWebpackConfig.devServer;
const protocol = devServerOptions.https ? "https" : "http";
const host = devServerOptions.host || "0.0.0.0";
const port = devServerOptions.port || 8080;

info("Starting development server...");

const compiler = webpack(devWebpackConfig);
const server = new WebpackDevServer(devServerOptions, compiler);

compiler.hooks.done.tap("serve", (stats) => {
  if (stats.hasErrors()) {
    return;
  }
  console.log(`App running at:`);
  console.log(`  - Local:   ${chalk.cyan(`${protocol}://${host}:${port}`)}`);
  console.log(`  - Network: ${chalk.cyan(`${protocol}://${getLocalIP()}:${port}`)}`);
});

const runServer = async () => {
  await server.start(port, host, (err) => {
    if (err) {
      process.exit(0);
    }
  });
};

runServer();
