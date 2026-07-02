import axios from 'axios'

const ACCESS_TOKEN_KEY = 'x-billing-access-token'
const REFRESH_TOKEN_KEY = 'x-billing-refresh-token'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, refreshToken }) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

let refreshRequest = null

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken = tokenStorage.getRefreshToken()

    if (!refreshToken) {
      tokenStorage.clear()
      return Promise.reject(error)
    }

    refreshRequest ??= authClient.post('/auth/refresh', { refreshToken })

    try {
      const response = await refreshRequest
      tokenStorage.setTokens(response.data)
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
      return httpClient(originalRequest)
    } catch (refreshError) {
      tokenStorage.clear()
      return Promise.reject(refreshError)
    } finally {
      refreshRequest = null
    }
  },
)