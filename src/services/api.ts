import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handler
const handleError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'An error occurred');
  }
  throw error;
};

// Exam API
export const examAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/exams');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/exams/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/exams', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/exams/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/exams/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};

// Student API
export const studentAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/students', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};

// Result API
export const resultAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/results');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/results/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getByStudent: async (studentId: string) => {
    try {
      const response = await api.get(`/results/student/${studentId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getByExam: async (examId: string) => {
    try {
      const response = await api.get(`/results/exam/${examId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/results', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/results/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/results/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};

export default api;