// src/api/user.js
import http from './http'

// ---- GET USER BY ID (Patient) ----
export async function getUserById(id) {
  const { data } = await http.get(`/auth/api/auth/${id}`)
  return data
}

// ---- GET DOCTOR BY ID ----
export async function getDoctorById(id) {
  const { data } = await http.get(`/appointments/doctors/${id}`)
  return data
}

// ---- GET DOCTOR BY EMAIL ----
// Call M2 appointment-service directly on 9169 (or override with VITE_M2_URL)
const M2_BASE = import.meta?.env?.VITE_M2_URL || 'http://localhost:9169'

export async function getDoctorByEmail(email) {
  const url = `${M2_BASE}/api/doctor/by-email?email=${encodeURIComponent(email)}`
  const { data } = await http.get(url)
  return data
}
