
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

// ===== AUTH =====
export const loginApi = (email: string, password: string) =>
    api.post('/auth/login', { email, password });

export const registerApi = (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password });


export const refreshApi = () => api.post('/auth/refresh');

export const logoutApi = () => api.post('/auth/logout');

export const getMeApi = () => api.get('/auth/me');

// ===== POSTS =====
export const createPostApi = (title: string, content: string) =>
    api.post('/posts', { title, content });

export const getMyPostsApi = (page: number) =>
    api.get(`/posts?page=${page}`);


export const deletePostApi = (id: string) =>
    api.delete(`/posts/${id}`);

export default api;
