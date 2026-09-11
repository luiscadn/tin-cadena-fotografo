// src/hooks/useAuth.ts

import { useAppDispatch } from './useAppDispatch'
import { useAppSelector } from './useAppSelector'
import { loginUser, logoutUser } from '../store/authSlice'
import type { LoginPayload } from '../services/auth.service'

export const useAuth = () => {
  const dispatch = useAppDispatch()

  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
  } = useAppSelector((state) => state.auth)

  const login = async (credentials: LoginPayload) => {
    return dispatch(loginUser(credentials)).unwrap()
  }

  const logout = async () => {
    return dispatch(logoutUser()).unwrap()
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  }
}