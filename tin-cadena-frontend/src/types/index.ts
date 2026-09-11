// src/types/index.ts

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  roles: Role[]
}

export interface AuthUser {
  username: string
  roles: string[]
}

export interface Role {
  id: number
  name: string
  description: string
  permissions: Permission[]
}

export interface Permission {
  id: number
  name: string
  description: string
}

export interface AuthResponse {
  token: string
  type: string
  username: string
  roles: string[]
  expiresIn: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface CartItem {
  key: string
  id: number
  name: string
  quantity: number
  price: number
  basePrice: number
  material: 'TruLife® Acrylic' | 'ChromaLuxe® Metal'
  size: 'Classic' | 'Statement' | 'Collector'
  image?: string
}

export interface CartState {
  items: CartItem[]
  total: number
}

export interface ApiError {
  message: string
  status: number
}

export interface Photo {
  id: number
  title: string
  description: string
  price: number
  edition: number
  status: 'AVAILABLE' | 'SOLD'
  photographerId: number
  categoryId: number
  image?: string
  createdAt?: string
}