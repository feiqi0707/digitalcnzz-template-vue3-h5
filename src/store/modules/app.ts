import { Toast } from 'vant'
import { containerType, loginApp, getonverified } from '@/utils/alipay'
import { alipayJSReady } from '@/utils'
declare const window: Window & { AlipayJSBridge: any }
const getUseInfo = (callback: Function) => {
  if (containerType() === 'app') {
    // app用法
    window.AlipayJSBridge.call('getAppUserInfo', (result: any) => {
      const { userInfo } = result
      console.log('accessToken', userInfo.accessToken)
      console.log('userInfo', userInfo)
      if (!result) {
        console.log('not result', result)
      } else if (result.success === 'false') {
        Toast({
          message: '请先完成登录',
          duration: 3000
        })
        setTimeout(() => {
          loginApp()
        }, 500)
      } else if (userInfo.authLevel !== 2) {
        Toast({
          message: '请先完成实名与人脸识别认证',
          duration: 3000
        })
        setTimeout(() => {
          getonverified()
        }, 500)
      } else {
        callback(userInfo)
      }
    })
  } else {
    const mockInfo = {
      accessToken:
        'c826c42f-7a9d-4cc8-a125-7f8adb0367b8c826c42f-7a9d-4cc8-a125-7f8adb0367b8c826c42f-7a9d-4cc8-a125-7f8adb0367b8c826c42f-7a9d-4cc8-a125-7f8adb0367b8',
      displayName: '张三',
      phone: '15452541254',
      idCode: '411123125412021122'
    }
    callback(mockInfo)
  }
}

const state = {
  userInfo: ''
}

const mutations = {
  SET_USER_INFO(state: any, data: any) {
    state.userInfo = data
  }
}

const actions = {
  // 设置name
  setUserInfo: ({ commit }: any) => {
    return new Promise(resolve => {
      alipayJSReady(
        getUseInfo((res: any) => {
          commit('SET_USER_INFO', res)
          resolve(res)
        })
      )
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
