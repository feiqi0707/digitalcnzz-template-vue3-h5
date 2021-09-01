// 微信h5-sdk服务集成
import { Toast } from 'vant'
declare const window: Window & { ap: any } & { wx: any }

export const wxReady = (callback: Function) => {
  if (window.wx.ready) {
    callback && callback()
  } else if (window.wx.error) {
    window.wx.error(() => {
      Toast('初始化异常，请重新进入')
    })
  }
}

// dataURL转文件对象
export const dataURLtoFile = (dataurl: string, filename = 'weixin-file') => {
  const arr = dataurl.split(',')
  const mime = arr.length > 0 && arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 微信端选择照片
export const wxChooseImg = (params: any) => {
  return new Promise(resolve => {
    wxReady(() => {
      window.wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function(res: any) {
          const localIds = res.localIds
          resolve(localIds[0])
        }
      })
    })
  }).then(localIds => {
    return new Promise(resolve => {
      window.wx.getLocalImgData({
        localId: localIds,
        success: (res: any) => {
          let localData = res.localData
          if (localData.indexOf('data:image') != 0) {
            localData = 'data:image/jpeg;base64,' + localData
          }
          localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg')
          const file = dataURLtoFile(localData)
          resolve(file)
        }
      })
    })
  })
}

// 微信端扫码
export const wxScan = (type: string) => {
  return new Promise(resolve => {
    wxReady(() => {
      window.wx.scanQRCode({
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        desc: 'scanQRCode',
        success: (res: any) => {
          let code = ''
          if (type === 'barcode') {
            code = res.resultStr?.split(',')[1] || ''
            if (!code) {
              Toast('内容为空')
              return
            }
          } else if (type === 'qrcode') {
            code = res.resultStr
            if (!code) {
              Toast('内容为空')
              return
            }
          }
          resolve(code)
        },
        fail: (e: any) => {
          Toast('内容为空')
        }
      })
    })
  })
}
