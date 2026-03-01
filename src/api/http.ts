import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 可以在这里添加token等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  (error) => {
    ElMessage.error(error.message || '网络错误')
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