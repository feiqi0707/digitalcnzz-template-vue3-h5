declare const window: Window & { AlipayJSBridge: any }
import request from '@/utils/request'
import { Dialog } from 'vant'

export const loginApp = () => {
  // zhbJssdk.lunchZhbLogin(() => {})
  window.AlipayJSBridge.call('login', (res: any) => {
    // resolve(res)
  })
}

export const getonverified = () => {
  window.AlipayJSBridge.call('getonverified', {}, () => {})
}

// 判断浏览器内核、手机系统等，使用
export const containerType = () => {
  const sUserAgent = navigator.userAgent.toLowerCase()
  console.log('sUserAgent', sUserAgent)
  const bIsApp = sUserAgent.indexOf('izzzwfwapp') > -1
  const bIsAlipay = sUserAgent.indexOf('alipayclient') > -1
  const bIsWeChat = sUserAgent.indexOf('micromessenger') > -1
  const bIsMiniApp = sUserAgent.indexOf('miniprogram') > -1
  const bIsDingTalk = sUserAgent.indexOf('dingtalk') > -1
  if (bIsApp) {
    return 'app'
  } else if (bIsAlipay && bIsMiniApp) {
    return 'xcxmini'
  } else if (bIsAlipay) {
    return 'xcx'
  } else if (bIsWeChat) {
    return 'wechat'
  } else if (bIsDingTalk) {
    return 'dingtalk'
  } else {
    return 'other'
  }
}

export const isDingTalk = () => {
  return containerType() == 'dingtalk'
}

export const isZfb = () => {
  return containerType() == 'xcx'
}

export const isZfbMini = () => {
  return containerType() == 'xcx' && containerType() == 'xcxmini'
}

export const isWx = () => {
  return containerType() == 'wechat'
}

export const isZhb = () => {
  return containerType() == 'app'
}

export const isOther = () => {
  return containerType() == 'other'
}

// 微信授权之后根据微信/支付宝的authCode换取用户的openId
export const getToken = async (params: Record<string, any>, type: string, callback: Function) => {
  const url =
    type === 'zfb'
      ? 'https://app-izz.zhengzhou.gov.cn:10019/third/open/ali/userid/get'
      : 'https://app-izz.zhengzhou.gov.cn:10019/third/open/wx/openid/check/get'
  try {
    const res = await request(url, {
      method: 'POST',
      data: {
        code: params?.code
      }
    })
    const { code, data } = res || {}
    if (code === 0) {
      if (type === 'zfb') {
        localStorage.setItem('zfbOpenId', data.userId)
      } else {
        localStorage.setItem('wxOpenId', data.token)
      }
      callback && callback() // 获取之后操作
    } else if (code === 400) {
      Dialog({
        title: '提示',
        message: '获取微信信息失败,请重新尝试'
      }).then(() => {
        window.location.reload()
      })
    }
  } catch (error) {
    console.log(error)
    // Toast('获取token失败')
  }
}

export const alipayJSReady = (callback: any) => {
  if (window.AlipayJSBridge) {
    callback && callback()
  } else {
    document.addEventListener('AlipayJSBridgeReady', callback, false)
  }
}

export const getUserInfo = () => {
  // 返回一个Promise实例对象
  return new Promise((resolve, reject) => {
    alipayJSReady(() => {
      window.AlipayJSBridge.call('getAppUserInfo', (res: Record<string, any>) => resolve(res))
    })
  })
}

// 退出
export const exitApp = () => {
  window.AlipayJSBridge.call('exitApp')
}

// 埋点
export const buriedAppliet = (data: Record<string, any>, callback: Function) => {
  alipayJSReady(() => {
    window.AlipayJSBridge.call(
      'buriedAppliet',
      {
        bizType: data.bizType, //  业务id (可不传)
        eventId: data.eventId, // 埋点id （必传）
        extParam: { ...data.extParam }
      },
      (result: Record<string, any>) => {
        callback(result)
      }
    )
  })
}
