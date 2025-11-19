export type UserRole = 'admin' | 'customer'

export interface User {
  _id?: string
  name: string
  email: string
  password?: string
  phone?: string
  address?: string
  role: UserRole
  createdAt?: Date
  updatedAt?: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  message: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

