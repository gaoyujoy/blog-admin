import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api' });
api.interceptors.request.use(config => { const token = localStorage.getItem('admin-token'); if (token)
    config.headers.Authorization = `Bearer ${token}`; return config; });
export const authApi = { login: (data) => api.post('/auth/login', data) };
export const tagsApi = { list: () => api.get('/tags'), create: (name) => api.post('/tags', { name }), update: (id, name) => api.put(`/tags/${id}`, { name }), remove: (id) => api.delete(`/tags/${id}`) };
export const postsApi = { list: (params) => api.get('/posts/admin/all', { params }), get: (id) => api.get(`/posts/${id}`), create: (data) => api.post('/posts', data), update: (id, data) => api.put(`/posts/${id}`, data), remove: (id) => api.delete(`/posts/${id}`) };
export const commentsApi = { list: () => api.get('/comments'), toggle: (id, visible) => api.patch(`/comments/${id}`, { visible }), remove: (id) => api.delete(`/comments/${id}`) };
