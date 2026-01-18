import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          await AsyncStorage.setItem('token', response.data.token);
          error.config.headers.Authorization = `Bearer ${response.data.token}`;
          return axios(error.config);
        } catch {
          await AsyncStorage.multiRemove(['user', 'token', 'refreshToken']);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getStats: () => api.get('/users/stats'),
};

export const taskAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  createTask: (data) => api.post('/tasks', data),
  generatePlan: (data) => api.post('/tasks/generate-plan', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export const tutorAPI = {
  getConversations: () => api.get('/tutor/conversations'),
  createConversation: (data) => api.post('/tutor/conversations', data),
  sendMessage: (conversationId, content) => api.post(`/tutor/conversations/${conversationId}/message`, { content }),
  getHint: (subject) => api.get(`/tutor/hint/${subject}`),
};

export const focusAPI = {
  startSession: (data) => api.post('/focus/session/start', data),
  takeBreak: (sessionId, type) => api.post(`/focus/session/${sessionId}/break`, { type }),
  completeSession: (sessionId, data) => api.post(`/focus/session/${sessionId}/complete`, data),
  getHistory: (days) => api.get('/focus/history', { params: { days } }),
};

export const contentAPI = {
  uploadFile: (formData) => api.post('/content/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  processContent: (id) => api.post(`/content/process/${id}`),
  getContent: (id) => api.get(`/content/${id}`),
  getAllContent: () => api.get('/content'),
};

export const progressAPI = {
  getProgress: (params) => api.get('/progress', { params }),
  recordProgress: (data) => api.post('/progress/record', data),
  getWeekly: () => api.get('/progress/weekly'),
};

export const parentAPI = {
  getChildren: () => api.get('/parent/children'),
  getChildProgress: (childId, days) => api.get(`/parent/child/${childId}/progress`, { params: { days } }),
  getChildSchedule: (childId, days) => api.get(`/parent/child/${childId}/schedule`, { params: { days } }),
};

export default api;
