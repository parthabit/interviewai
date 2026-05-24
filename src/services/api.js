/**
 * API Service — connects frontend to backend
 * Uses REACT_APP_API_URL env var (set in Vercel dashboard)
 */
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 30000 });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(err.response?.data || { error: 'Network error' });
  }
);

export const authAPI = {
  register: (d) => api.post('/auth/register', d),
  login: (d) => api.post('/auth/login', d),
  me: () => api.get('/auth/me'),
  updateProfile: (d) => api.put('/auth/profile', d),
};

export const interviewAPI = {
  start: (d) => api.post('/interviews/start', d),
  sendMessage: (id, content) => api.post(`/interviews/${id}/message`, { content }),
  end: (id, duration) => api.post(`/interviews/${id}/end`, { duration }),
  history: () => api.get('/interviews/history'),
};

export const resumeAPI = {
  analyze: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return api.post('/resume/analyze', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const analyticsAPI = {
  summary: () => api.get('/analytics/summary'),
};

export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: (params) => api.get('/admin/users', { params }),
  updateUser: (id, d) => api.patch(`/admin/users/${id}`, d),
};

export const certAPI = {
  generate: (d) => api.post('/certificates/generate', d),
  list: () => api.get('/certificates'),
};

export default api;
