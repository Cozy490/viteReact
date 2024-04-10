/**
 * 集成Abstract
 * 先不用types里边的限制，因为时间太短，那样写太慢了
 * @date 2022-8-25
 */
import Abstract from '../abstract'
// import {
//   AuthLoginType
// } from '../types'
import { IObject } from '@/utils/commonInterface'
const whoApi = process.env.VUE_APP_Who
const tokenApi = process.env.VUE_APP_TokenUrl

class Basic extends Abstract {
  /**
    * 获取用户信息
    *
    */
  getUserInfo (data: IObject) {
    return this.getReq({ baseURL: whoApi, url: '/voila/v2/who', data })
  }

  /**
    * 刷新token
    *
    */
  refreshTokenApi (data: IObject) {
    return this.postReq({ baseURL: tokenApi, url: '/auth/refresh-token', data })
  }
}

// 单列模式返回对象
let instance
export default (() => {
  if (instance) return instance
  instance = new Basic()
  return instance
})()
