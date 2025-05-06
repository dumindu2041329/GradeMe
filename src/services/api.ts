import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Exam API
export const examAPI = {
  getAll: () => api.get('/exams'),
  getById: (id: string) => api.get(`/exams/${id}`),
  create: (data: any) => api.post('/exams', data),
  update: (id: string, data: any) => api.put(`/exams/${id}`, data),
  delete: (id: string) => api.delete(`/exams/${id}`)
};

// Student API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`)
};

// Result API
export const resultAPI = {
  getAll: () => api.get('/results'),
  getById: (id: string) => api.get(`/results/${id}`),
  getByStudent: (studentId: string) => api.get(`/results/student/${studentId}`),
  getByExam: (examId: string) => api.get(`/results/exam/${examId}`),
  create: (data: any) => api.post('/results', data),
  update: (id: string, data: any) => api.put(`/results/${id}`, data),
  delete: (id: string) => api.delete(`/results/${id}`)
};

export default api;