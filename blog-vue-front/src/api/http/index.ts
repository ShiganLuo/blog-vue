import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { BaseResponse} from './types'
import { API_CODE } from './types'

const service: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
})

// 请求拦截器
service.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  config.headers['Authorization'] = localStorage.getItem('token') || ''
  return config
})

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const res = response.data

    // 根据业务码处理不同场景
    switch (res.code) {
      case API_CODE.SUCCESS:
        return res.result // 直接返回result字段数据
      case API_CODE.UNAUTHORIZED:
        window.location.href = '/login'
        return Promise.reject(new Error('请重新登录'))
      default:
        // 其他错误消息提示
        return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  (error) => {
    // 处理HTTP错误状态码
    const messageMap: Record<number, string> = {
      400: '请求错误',
      401: '未授权',
      403: '拒绝访问',
      404: '资源不存在',
      500: '服务器错误'
    }
    const message = messageMap[error.response?.status] || '网络连接异常'
    return Promise.reject(new Error(message))
  }
)

/**
 * 封装核心请求方法
 * @param config - 请求配置
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config)
}

/**
 * 带完整响应结构的请求（保留code/message）
 * @param config - 请求配置
 */
export function fullRequest<T = any>(
  config: AxiosRequestConfig
): Promise<BaseResponse<T>> {
  return service(config).then((res) => res.data)
}

export default service