import { request } from './http'

// 短链接类型定义
export interface ShortLink {
  id: number
  name: string
  originalUrl: string
  shortCode: string
  status: 'ENABLED' | 'DISABLED'
  createdAt: string
  updatedAt: string
}

// 生成短码响应类型
export interface GenerateShortCodeResponse {
  shortCode: string
}

// 通用响应类型
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

// 短链接API
export const shorturlApi = {
  // 获取短链接列表
  getList: (params?: { name?: string }) => {
    return request.get<ApiResponse<ShortLink[]>>('/shortlinks', params)
  },
  
  // 新增短链接
  create: (data: { name: string; originalUrl: string }) => {
    return request.post<ApiResponse<ShortLink>>('/shortlinks', data)
  },
  
  // 编辑短链接
  update: (id: number, data: { name: string; originalUrl: string }) => {
    return request.put<ApiResponse<ShortLink>>(`/shortlinks/${id}`, data)
  },
  
  // 删除短链接
  delete: (id: number) => {
    return request.delete<ApiResponse<void>>(`/shortlinks/${id}`)
  },
  
  // 启用短链接
  enable: (id: number) => {
    return request.patch<ApiResponse<ShortLink>>(`/shortlinks/${id}/enable`)
  },
  
  // 禁用短链接
  disable: (id: number) => {
    return request.patch<ApiResponse<ShortLink>>(`/shortlinks/${id}/disable`)
  },
  
  // 生成短码
  generateShortCode: () => {
    return request.post<ApiResponse<GenerateShortCodeResponse>>('/shortlinks/generate')
  }
}

export default shorturlApi