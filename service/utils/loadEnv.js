'use strict'

const path = require('path')
// dotenv 获取.env文件中环境变量
const dotenv = require('dotenv')
// dotenv-expand可以使用之前存在的变量，进行连接操作
const dotenvExpand = require('dotenv-expand')
const { error } = require('./logger')

module.exports = function loadEnv(mode) {
  // 获取mode对应的文件名 .env.production和.env.development
  const basePath = path.resolve(process.cwd(), `.env${mode ? `.${mode}` : ``}`)
  // 该文件并不存在，需要创建
  const localPath = `${basePath}.local`

  const load = (envPath) => {
    try {
      const env = dotenv.config({ path: envPath, debug: process.env.DEBUG })
      dotenvExpand.expand(env)
    } catch (err) {
      // only ignore error if file is not found：只忽视文件找不到的错误
      if (err.toString().indexOf('ENOENT') < 0) {
        error(err)
      }
    }
  }

  load(localPath)
  load(basePath)

  // by default, NODE_ENV and BABEL_ENV are set to "development" unless mode
  // is production or test. However the value in .env files will take higher
  // priority.
  if (mode) {
    const defaultNodeEnv = mode === 'production' || mode === 'test' ? mode : 'development'
    if (process.env.NODE_ENV == null) {
      process.env.NODE_ENV = defaultNodeEnv
    }
    if (process.env.BABEL_ENV == null) {
      process.env.BABEL_ENV = defaultNodeEnv
    }
  }
}
