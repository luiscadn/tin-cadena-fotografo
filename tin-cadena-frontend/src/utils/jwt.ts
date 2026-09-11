// src/utils/jwt.ts

import { JWT_TOKEN_KEY, USER_KEY } from './constants'
import type { AuthUser } from '../types'

export const tokenUtils = {
  setToken: (token: string): void => {
    localStorage.setItem(JWT_TOKEN_KEY, token)
  },

  getToken: (): string | null => {
    return localStorage.getItem(JWT_TOKEN_KEY)
  },

  removeToken: (): void => {
    localStorage.removeItem(JWT_TOKEN_KEY)
  },

  setUser: (user: AuthUser): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getUser: (): AuthUser | null => {
    const storedUser = localStorage.getItem(USER_KEY)

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser) as AuthUser
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY)
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as {
        exp: number
      }

      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  },

  clearAuth: (): void => {
    tokenUtils.removeToken()
    tokenUtils.removeUser()
  },
}