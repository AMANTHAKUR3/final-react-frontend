// src/api/http.js
import axios from 'axios'

const baseURL = import.meta?.env?.VITE_API_BASE_URL || '/api'

const http = axios.create({
  baseURL,
  withCredentials: false, // no cookie-based auth currently
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Normalize errors
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Unexpected error'
    return Promise.reject({ status, message, raw: error })
  }
)

export default http