import { mockExams, mockResults, MockExam, MockResult } from '../lib/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const examAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockExams };
  },
  getById: async (id: string) => {
    await delay(500);
    const exam = mockExams.find(e => e._id === id);
    if (!exam) throw new Error('Exam not found');
    return { data: exam };
  },
  create: async (data: Partial<MockExam>) => {
    await delay(500);
    return { data: { ...data, _id: Date.now().toString() } };
  },
  update: async (id: string, data: Partial<MockExam>) => {
    await delay(500);
    return { data: { ...data, _id: id } };
  },
  delete: async (id: string) => {
    await delay(500);
    return { data: { message: 'Exam deleted successfully' } };
  }
};

export const resultAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockResults };
  },
  getById: async (id: string) => {
    await delay(500);
    const result = mockResults.find(r => r._id === id);
    if (!result) throw new Error('Result not found');
    return { data: result };
  },
  create: async (data: Partial<MockResult>) => {
    await delay(500);
    return { data: { ...data, _id: Date.now().toString() } };
  },
  update: async (id: string, data: Partial<MockResult>) => {
    await delay(500);
    return { data: { ...data, _id: id } };
  },
  delete: async (id: string) => {
    await delay(500);
    return { data: { message: 'Result deleted successfully' } };
  }
};

export const studentAPI = {
  getAll: async () => {
    await delay(500);
    return { data: [] };
  },
  getById: async (id: string) => {
    await delay(500);
    return { data: null };
  },
  create: async (data: any) => {
    await delay(500);
    return { data: { ...data, _id: Date.now().toString() } };
  },
  update: async (id: string, data: any) => {
    await delay(500);
    return { data: { ...data, _id: id } };
  },
  delete: async (id: string) => {
    await delay(500);
    return { data: { message: 'Student deleted successfully' } };
  }
};

export default {
  get: () => Promise.resolve({ data: {} }),
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} })
};