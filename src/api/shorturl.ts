import { request } from './http'
import type { ShortLink, GenerateShortCodeResponse, ApiResponse } from '../types'

export const shorturlApi = {
  generate: (data: { url: string; appId?: string }) => {
    return request.post<ApiResponse<GenerateShortCodeResponse>>('/api/short-url/generate', data)
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