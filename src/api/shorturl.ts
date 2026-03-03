import { request } from './http'
import type { ShortLink, GenerateShortCodeResponse, ApiResponse } from '../types'

export const shorturlApi = {
  generate: (data: { url: string; appId?: string }) => {
    // 构建查询参数
    const params = new URLSearchParams()
    params.append('url', data.url)
    if (data.appId) {
      params.append('appId', data.appId)
    }
    return request.get<ApiResponse<GenerateShortCodeResponse>>(`/api/short-url/generate?${params.toString()}`)
  },
  
  disable: (shortCode: string) => {
    return request.put<ApiResponse<void>>(`/api/short-url/disable/${shortCode}`)
  },
  
  enable: (shortCode: string) => {
    return request.put<ApiResponse<void>>(`/api/short-url/enable/${shortCode}`)
  },
  
  delete: (shortCode: string) => {
    return request.delete<ApiResponse<void>>(`/api/short-url/${shortCode}`)
  }
}

export default shorturlApi