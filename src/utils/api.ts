import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () => api.get('/auth/me'),
};

// Notes API
export const notesAPI = {
  getNotes: () => api.get('/notes'),
  getNote: (id: string) => api.get(`/notes/${id}`),
  createNote: (title: string, body: string) =>
    api.post('/notes', { title, body }),
  updateNote: (id: string, title: string, body: string) =>
    api.put(`/notes/${id}`, { title, body }),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
};

export default api;
