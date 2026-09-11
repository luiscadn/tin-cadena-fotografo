// src/services/api.ts

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { API_BASE_URL, HTTP_STATUS } from '../utils/constants'
import { tokenUtils } from '../utils/jwt'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Agrega el token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor: Maneja errores 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Token expirado o inválido
      tokenUtils.clearAuth()
      // Redirigir a login es responsabilidad del componente
      window.location.href = `${import.meta.env.BASE_URL}login`
    }
    return Promise.reject(error)
  },
)

export default api