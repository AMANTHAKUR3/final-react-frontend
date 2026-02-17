import axios from 'axios';

// This tells Axios exactly where your Spring Boot server is living
const api = axios.create({
  baseURL: 'http://localhost:8083/api/ehr', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export const ehrService = {
  // GET: http://localhost:8083/api/ehr/patient-ehr?patientId=...
  getPatientData: (patientId) => api.get(`/patient-ehr`, { params: { patientId } }),

  // POST: http://localhost:8083/api/ehr/upsert-record
  upsertRecord: (data) => api.post('/upsert-record', data),

  // PUT: http://localhost:8083/api/ehr/update-status
  updateStatus: (patientId, status) => api.put('/update-status', { patientId, status })
};