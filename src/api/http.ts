import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'
import { authService } from '../utils/auth'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Mock 数据
const mockData: Record<string, any> = {
  '/api/user/register': {
    code: 200,
    data: { id: 1, username: 'test' },
    message: 'success'
  },
  '/api/user/login': {
    code: 200,
    data: {
      token: 'mock_token_' + Date.now(),
      user: { id: 1, username: 'test' }
    },
    message: 'success'
  },
  '/api/short-url/generate': {
    code: 200,
    data: {
      shortCode: Math.random().toString(36).substring(2, 8)
    },
    message: 'success'
  },
  '/api/short-url/enable/:shortCode': {
    code: 200,
    data: null,
    message: 'success'
  },
  '/api/short-url/disable/:shortCode': {
    code: 200,
    data: null,
    message: 'success'
  },
  '/api/short-url/:shortCode': {
    code: 200,
    data: null,
    message: 'success'
  }
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token认证
    const token = authService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  (error) => {
    // 模拟后端响应
    const url = error.config?.url || ''
    for (const mockUrl in mockData) {
      const regex = new RegExp(mockUrl.replace(/:\w+/g, '[^/]+'))
      if (regex.test(url)) {
        const mockResponse = mockData[mockUrl]
        return Promise.resolve(mockResponse)
      }
    }
    
    // 处理401未授权
    if (error.response?.status === 401) {
      authService.clearAuth()
      window.location.href = '/login'
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    
    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  get<T = any>(url: string, params?: any): Promise<T> {
    return service.get(url, { params })
  },
  post<T = any>(url: string, data?: any): Promise<T> {
    return service.post(url, data)
  },
  put<T = any>(url: string, data?: any): Promise<T> {
    return service.put(url, data)
  },
  delete<T = any>(url: string): Promise<T> {
    return service.delete(url)
  },
  patch<T = any>(url: string, data?: any): Promise<T> {
    return service.patch(url, data)
  }
}

export default service