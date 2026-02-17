// src/api/http.js
import axios from 'axios'

const baseURL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8020'

const http = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request Interceptor: Add JWT token to every request
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle errors and token expiration
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      localStorage.clear()
      window.location.href = '/login'
      return Promise.reject({ status, message: 'Session expired. Please login again.' })
    }
    
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Unexpected error'
    return Promise.reject({ status, message, raw: error })
  }
)

export default http
