import axios from 'axios'; import type { Comment, Post, Tag } from './types';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api' });
api.interceptors.request.use(config => { const token = localStorage.getItem('admin-token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const authApi = { login: (data: { username: string; password: string }) => api.post<{ accessToken: string }>('/auth/login', data) };
export const tagsApi = { list: () => api.get<Tag[]>('/tags'), create: (name: string) => api.post('/tags', { name }), update: (id: string, name: string) => api.put(`/tags/${id}`, { name }), remove: (id: string) => api.delete(`/tags/${id}`) };
export const postsApi = { list: (params?: Record<string, unknown>) => api.get<{ items: Post[]; total: number }>('/posts/admin/all', { params }), get: (id: string) => api.get<Post>(`/posts/${id}`), create: (data: Partial<Post>) => api.post('/posts', data), update: (id: string, data: Partial<Post>) => api.put(`/posts/${id}`, data), remove: (id: string) => api.delete(`/posts/${id}`) };
export const commentsApi = { list: () => api.get<Comment[]>('/comments'), toggle: (id: string, visible: boolean) => api.patch(`/comments/${id}`, { visible }), remove: (id: string) => api.delete(`/comments/${id}`) };
