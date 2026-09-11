// src/services/auth.service.ts

import api from './api'
import type { AuthResponse, User } from '../types'
import { ENDPOINTS } from '../utils/constants'

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export const authService = {
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    )

    return response.data
  },

  register: async (userData: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      userData,
    )

    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>(`${ENDPOINTS.USERS.BASE}/me`)

    return response.data
  },
}