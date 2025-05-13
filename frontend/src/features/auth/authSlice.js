import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: false,
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.permissions = action.payload.permissions || []
      
      // Store token in localStorage for API requests
      if (action.payload.user && action.payload.user.token) {
        localStorage.setItem('token', action.payload.user.token)
      }
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.permissions = []
      state.isAuthenticated = false
      
      // Clear stored token
      localStorage.removeItem('token')
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions

// Async thunk actions can be added here later if needed

export default authSlice.reducer
