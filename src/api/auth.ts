import { request } from './http'
import type { ApiResponse } from '../types'

export interface User {
  id: number
  username: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authApi = {
  // 用户注册
  register: (data: { username: string; password: string }) => {
    return request.post<ApiResponse<User>>('/api/user/register', data)
  },

  // 用户登录
  login: (data: { username: string; password: string }) => {
    return request.post<ApiResponse<LoginResponse>>('/api/user/login', data)
  }
}

export default authApi