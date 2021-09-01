import { getToken, containerType } from '@/utils/alipay'
import { Dialog, Toast } from 'vant'
import { v4 as uuidv4 } from 'uuid'
import request from '@/utils/request'
import config from '@/config/index.ts'
import qs from 'qs'
declare const window: Window & { ap: any } & { wx: any }

const { openWechatApi } = config

// 拉起支付宝小程序授权
export const openZfbMiniAuth = (url: string) => {
  url = `alipays://platformapi/startapp?appId=2019120469583923&query=${encodeURIComponent(
    `lightapptype=4&isneeduserinfo=1&url=${url}?brand=alipay`
  )}`
  window.location.href = url
}

// 拉起微信授权
export const openWxAuth = (url: string) => {
  url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0324f808b68fc645&redirect_uri=${encodeURIComponent(
    url
  )}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
  window.location.href = url
}

// 拉起支付宝授权获取用户authCode
export const openZfbAuth = (callback: Function) => {
  window.ap.getAuthCode(
    {
      appId: '2021002172622916', // 公司内部支付宝开发者账号，切勿改动
      scopes: ['auth_user']
    },
    (res: any) => {
      const { error, authCode } = res || {}
      if (error === 11) {
        Dialog.alert({
          title: '温馨提示',
          message: '授权失败,请确认。'
        })
      } else {
        getToken({ code: authCode }, 'zfb', callback)
      }
    }
  )
}

// 初始化微信sdk配置信息
export const wxInit = (jsapiTickt: string) => {
  const timestamp = new Date().getTime()
  const nonceStr = uuidv4()
  const sha1 = require('js-sha1')

  const sha11 = (jsapiTicket: string) => {
    let url = window.location.href
    const index = url.indexOf('#')
    if (index !== -1) {
      url = url.slice(0, index)
    }
    const md5sum = sha1(`jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`)
    return md5sum.toString()
  }

  window.wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
    appId: 'wx0324f808b68fc645', // 必填，公众号的唯一标识
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: sha11(jsapiTickt), // 必填，签名，见附录1
    jsApiList: ['scanQRCode', 'chooseImage', 'getLocalImgData']
  })
}

// 获取配置微信sdk的ticket
export const configWXSDK = async () => {
  // 拉取微信tickets配置
  const res = await request(openWechatApi)
  const { code, data } = res || {}
  if (code === 0) {
    wxInit(data?.ticket)
  } else {
    Toast.fail({
      message: '初始化失败，请在微信端重新扫码进入。'
    })
  }
}

// 开启多端授权登录验证(郑好办、微信、支付宝)
export const startMutiPlatformVerify = (initVueApp: Function) => {
  if (containerType() === 'app') {
    initVueApp && initVueApp()
  } else if (containerType() == 'wechat') {
    const openId = localStorage.getItem('wxOpenId')
    if (!openId) {
      const search = window.location.search.substring(1)
      const query = qs.parse(search, { ignoreQueryPrefix: true })
      if (query && query.code) {
        getToken(query, 'wx', () => {
          // 微信授权
          openWxAuth(window.location.href)
        })
      } else {
        // 拉起微信授权
        openWxAuth(window.location.href)
      }
    } else {
      // 授权成功获取到openId之后渲染页面
      initVueApp && initVueApp()
    }
  } else if (containerType() === 'xcxmini') {
    if (!window.location.href.includes('accesstoken')) {
      openZfbMiniAuth(window.location.href)
    } else if (containerType() !== 'other') {
      initVueApp && initVueApp()
    } else {
      Toast({
        duration: 0,
        forbidClick: true,
        message: '请打开郑好办App或者支付宝小程序查看'
      })
      window.location.href = 'izziphoneapp://'
    }
  } else if (containerType() === 'xcx') {
    const openId = localStorage.getItem('zfbOpenId')
    if (openId) {
      initVueApp && initVueApp()
    } else {
      openZfbAuth(() => {
        initVueApp && initVueApp()
      })
    }
  } else {
    Toast({
      duration: 0,
      forbidClick: true,
      message: '请打开郑好办App、微信或者支付宝查看'
    })
    window.location.href = 'izziphoneapp://'
  }
}
