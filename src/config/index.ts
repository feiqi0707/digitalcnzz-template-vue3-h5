// 根据环境引入不同配置 process.env.NODE_ENV
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./env.' + process.env.NODE_ENV)
export default {
  ...config,
  title: config.title
}
