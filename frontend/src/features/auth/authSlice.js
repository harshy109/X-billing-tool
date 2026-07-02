import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { httpClient, tokenStorage } from '../../api/httpClient.js'

const hydrateUser = () => {
  const userJson = localStorage.getItem('x-billing-user')
  return userJson ? JSON.parse(userJson) : null
}

const initialState = {
  user: hydrateUser(),
  status: 'idle',
  error: null,
}

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await httpClient.post('/auth/login', credentials)
    const { user, accessToken, refreshToken } = response.data

    tokenStorage.setTokens({ accessToken, refreshToken })
    localStorage.setItem('x-billing-user', JSON.stringify(user))

    return user
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to log in')
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = tokenStorage.getRefreshToken()
    await httpClient.post('/auth/logout', { refreshToken })
    tokenStorage.clear()
    localStorage.removeItem('x-billing-user')
  } catch (error) {
    tokenStorage.clear()
    localStorage.removeItem('x-billing-user')
    return rejectWithValue(error.response?.data?.message || 'Unable to log out')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.status = 'idle'
        state.error = null
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null
        state.status = 'idle'
        state.error = null
      })
  },
})

export const selectAuthUser = (state) => state.auth.user
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer