import axios, { AxiosError, type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/generated'
import { useUserStore } from '@/stores/useUserStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：添加 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：处理业务状态码和错误
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const { data } = response

    // 业务成功
    if (data.code === 0) {
      return response
    }

    // 业务错误
    return Promise.reject({
      code: data.code,
      message: data.message,
      timestamp: data.timestamp,
    })
  },
  (error: AxiosError) => {
    // 401 未授权 - 自动登出
    if (error.response?.status === 401) {
      useUserStore.getState().clearAuthData()
      window.location.href = '/auth/login'
      return Promise.reject(error)
    }

    // 网络错误
    if (!error.response) {
      return Promise.reject({
        code: -1,
        message: '网络错误，请检查网络连接',
      })
    }

    // 其他 HTTP 错误
    return Promise.reject({
      code: error.response.status,
      message: error.message,
    })
  }
)

export default api
