/**
 * axios基础构建
 */

// import getUrl from './config'
// import storage from '@/utils/storage'
import instance from './intercept'
import { AxiosRequest } from './types'
import { IObject } from '@/utils/commonInterface'
import qs from 'qs'
class Abstract {
      protected baseURL: any = process.env.VUE_APP_BaseURL;
      protected headers: IObject = {
        ContentType: 'application/json;charset=UTF-8'
      }

      private url = ''
      private async apiAxios ({ baseURL = this.baseURL, headers = this.headers, method, url, data, params, responseType }: AxiosRequest): Promise<IObject> {
        console.log('baseURL', url !== '/auth/refresh-token')
        if (url !== '/auth/refresh-token') {
          headers.Authorization = localStorage.getItem('token') || ''
        } else {
          // 删除Authorization
          delete headers.Authorization
        }

        headers['X-MD-App-Device-Id'] = localStorage.getItem('deviceId') || ''
        if (method === 'GET') {
          url = data && Object.keys(data).length > 0 ? `${url}?${qs.stringify(data)}` : url
        }
        return new Promise((resolve, reject) => {
          instance({
            baseURL,
            headers,
            method,
            url,
            params,
            data,
            responseType
          }).then((res) => {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              resolve(res.data)
            }
          }).catch((err) => {
            reject(err)
          })
        })
      }

      /**
      * GET类型的网络请求
      */
      protected getReq ({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
        return this.apiAxios({ baseURL, headers, method: 'GET', url, data, params, responseType })
      }

      /**
      * POST类型的网络请求
      */
      protected postReq ({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
        return this.apiAxios({ baseURL, headers, method: 'POST', url, data, params, responseType })
      }

      /**
      * PUT类型的网络请求
      */
      protected putReq ({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
        return this.apiAxios({ baseURL, headers, method: 'PUT', url, data, params, responseType })
      }

      /**
      * DELETE类型的网络请求
      */
      protected deleteReq ({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
        return this.apiAxios({ baseURL, headers, method: 'DELETE', url, data, params, responseType })
      }

      /**
      * POST导出
      */
      protected exportReq ({ baseURL, headers, url, data, params }: AxiosRequest) {
        return this.apiAxios({ baseURL, headers, method: 'POST', url, data, params, responseType: 'blob' })
      }
}

export default Abstract
