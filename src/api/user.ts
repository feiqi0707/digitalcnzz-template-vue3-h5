/*
 * @Author: feiqi
 * @Date: 2020-10-10 22:05:42
 * @Last Modified by:   feiqi
 * @Last Modified time: 2020-10-10 22:05:42
 */
import request from '@/utils/request'
import qs from 'qs'

export const getConvention = (params: {}) => {
  return request.post(`/community/homepage/convention`, qs.stringify(params))
}
