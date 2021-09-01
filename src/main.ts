import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { vantPlugins } from '@/plugins/vant'
import Bmob from '@/plugins/global'
import { vConsolePlugins } from '@/plugins/vconsole'
import '@/assets/css/index.scss'
import '@/assets/scss/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'
import { isZhb, isZfb, isWx, isOther, isZfbMini } from '@/utils/alipay'
import { Toast, Dialog } from 'vant'
import '@/utils/auth'
import { configWXSDK, startMutiPlatformVerify } from '@/utils/auth'

const app = createApp(App)
app.config.globalProperties.$toast = Toast
app.config.globalProperties.$dialog = Dialog
app.config.globalProperties.$isWx = isWx()
app.config.globalProperties.$isZhb = isZhb()
app.config.globalProperties.$isZfb = isZfb()
app.config.globalProperties.$isOther = isOther()
app.config.globalProperties.$isZfbMini = isZfbMini()
app.config.globalProperties.$bmob = Bmob

const initVueApp = () => {
  app
    .use(store)
    .use(router)
    .use(vConsolePlugins)
    .use(vantPlugins)
    .mount('#app')
  configWXSDK() // 获取微信sdk签名信息
}

initVueApp() // 本地调试以及不需要支持其他平台(微信、支付宝)登录的话启用，如果需要多端支持，打包发布之前需要注释掉
// startMutiPlatformVerify(initVueApp) // 如果需要多端支持，打包发布线上需要开启
