// src/store/authSlice.ts

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { authService, type LoginPayload } from '../services/auth.service'
import type { AuthState, AuthUser } from '../types'
import { tokenUtils } from '../utils/jwt'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)

      const user: AuthUser = {
        username: response.username,
        roles: response.roles,
      }

      tokenUtils.setToken(response.token)
      tokenUtils.setUser(user)

      return {
        token: response.token,
        user,
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'No fue posible iniciar sesión',
      )
    }
  },
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    tokenUtils.clearAuth()
  },
)

const storedToken = tokenUtils.getToken()
const storedUser = tokenUtils.getUser()

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken && storedUser),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload

      if (action.payload) {
        tokenUtils.setUser(action.payload)
      } else {
        tokenUtils.removeUser()
      }
    },

    clearError: (state) => {
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload as string
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { setUser, clearError } = authSlice.actions

export default authSlice.reducer