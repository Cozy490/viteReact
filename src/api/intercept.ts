import axios, { AxiosRequestConfig, Method } from 'axios'
import { IObject } from '@/utils/commonInterface'
import { basicApi } from './index'
import _ from 'lodash'
// 定义接口
interface PendingType {
    url: string | undefined;
    method: Method | undefined | string;
    params: IObject;
    data: IObject;
    // eslint-disable-next-line @typescript-eslint/ban-types
    cancel: Function;
}

// 取消重复请求
const pending: Array<PendingType> = []
const CancelToken = axios.CancelToken
// axios 实例
const instance = axios.create({
  timeout: 60000,
  withCredentials: false,
  responseType: 'json'
})
// loading
// let loadingInstance: ElLoadingComponent

let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void; }[] = []

const processQueue = (error: unknown, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// 移除重复请求
const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key
    const list: PendingType = pending[key]
    // 当前请求在数组中存在时执行函数体
    if (list.url === config.url && list.method === config.method && JSON.stringify(list.params) === JSON.stringify(config.params) && JSON.stringify(list.data) === JSON.stringify(config.data)) {
      // 执行取消操作
      list.cancel('操作太频繁，请稍后再试')
      // 从数组中移除记录
      pending.splice(item, 1)
    }
  }
}

// 去登录页面
const toLogin = () => {
  const webUrl = window.location.origin
  localStorage.removeItem('token')
  localStorage.removeItem('deviceId')
  const nodeEev = import.meta.env.MODE
  // localStorage.removeItem('token')
  if (nodeEev === 'production') {
    window.location.href = `https://osss/#/sign-in?redirect=${webUrl}`
  } else if (nodeEev === 'test' || nodeEev === 'development') {
    window.location.href = `https://sss/#/sign-in?redirect=${webUrl}`
    // window.location.href = `http://localhost:8081/#/sign-in?redirect=${webUrl}`
  }
}

// 添加请求拦截器
instance.interceptors.request.use(
  request => {
    // loadingInstance = Loading.service({
    //   text: '加载中',
    //   background: 'rgba(0, 0, 0, 0.3)'
    // })

    removePending(request)
    request.cancelToken = new CancelToken((c) => {
      pending.push({ url: request.url, method: request.method, params: request.params, data: request.data, cancel: c })
    })
    return request
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // loadingInstance.close()
    removePending(response.config)
    return response
  },
  error => {
    // loadingInstance.close()
    const response = error.response
    const { response: { status } } = error
    const originalRequest = error.config
    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true
        basicApi.refreshTokenApi({
          token: localStorage.getItem('refreshToken')
        })
          .then((res:IObject) => {
            isRefreshing = false
            console.log(res, 'res')
            if (res.meta && res.meta.code !== 0) {
              toLogin()
              return
            }
            const accessToken = _.get(res, ['data', 'auth', 'accessToken'], null)
            localStorage.setItem('token', accessToken)
            localStorage.setItem('refreshToken', _.get(res, ['data', 'auth', 'refreshToken'], null))

            originalRequest.headers.Authorization = accessToken
            processQueue(null, accessToken)
          })
          .catch((refreshTokenError: unknown) => {
            processQueue(refreshTokenError, null)
          })
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = token
          return instance(originalRequest)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    } else {
      alert('接口报错')
    }
    // 超时重新请求
    const config:IObject = error.config
    // 全局的请求次数,请求的间隙
    const [RETRY_COUNT, RETRY_DELAY] = [0, 1000]

    if (config && RETRY_COUNT) {
      // 设置用于跟踪重试计数的变量
      config.__retryCount = config.__retryCount || 3
      // 检查是否已经把重试的总数用完
      if (config.__retryCount >= RETRY_COUNT) {
        return Promise.reject(response || { message: error.message })
      }
      // 增加重试计数
      config.__retryCount++
      // 创造新的Promise来处理指数后退
      const backoff = new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
        }, RETRY_DELAY || 1)
      })
      // instance重试请求的Promise
      return backoff.then(() => {
        return instance(config)
      })
    }

    // eslint-disable-next-line
        return Promise.reject(response || {message: error.message});
  }
)

export default instance
