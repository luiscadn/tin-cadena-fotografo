// src/utils/constants.ts

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api'
export const WS_URL =
  import.meta.env.VITE_WS_URL || 'http://localhost:8085/ws'

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },
  PHOTOS: {
    BASE: '/photographs',
    BY_ID: (id: number) => `/photographs/${id}`,
  },
  ROLES: {
    BASE: '/roles',
  },
  PERMISSIONS: {
    BASE: '/permissions',
  },
} as const

export const JWT_TOKEN_KEY = 'photomarket_token'
export const USER_KEY = 'photomarket_user'

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  PHOTOGRAPHER: 'ROLE_PHOTOGRAPHER',
  BUYER: 'ROLE_BUYER',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const