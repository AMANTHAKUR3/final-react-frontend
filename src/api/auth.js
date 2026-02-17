// src/api/auth.js
import http from './http'

// ---- REGISTER ----
export async function registerUser(payload) {
  // POST /api/auth/register
  const { data } = await http.post('/auth/register', payload)
  return data
}

// ---- LOGIN ----
export async function login(payload) {
  const { data } = await http.post('/auth/login', payload);
  localStorage.setItem("loginInfo", JSON.stringify(data));
  return data
}

// ---- RESET PASSWORD (PUT) ----
export async function resetPassword(payload) {
  const { data } = await http.put('/auth/reset-password', payload)
  return data
}

// ---- LOGOUT (optional) ----
export async function logout() {
  try {
    // await http.post('/auth/logout') // if you add it later
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  } catch {}
}