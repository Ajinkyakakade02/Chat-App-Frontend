import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://nova-chat-backend.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const api = {
  async login(email, password) {
    const response = await axiosInstance.post('/api/users/login', { email, password });
    localStorage.setItem('user', JSON.stringify(response.data));
    // Store a dummy token to satisfy route guard
    localStorage.setItem('token', 'dummy-token-' + Date.now());
    localStorage.setItem('session_expiry', String(Date.now() + 24 * 60 * 60 * 1000));
    return response.data;
  },

  async register(fullName, email, password) {
    const response = await axiosInstance.post('/api/users/register', { fullName, email, password });
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('token', 'dummy-token-' + Date.now());
    localStorage.setItem('session_expiry', String(Date.now() + 24 * 60 * 60 * 1000));
    return response.data;
  },

  async logout(userId) {
    await axiosInstance.post(`/api/users/logout/${userId}`);
    localStorage.clear();
  },

  async getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) return JSON.parse(user);
    throw new Error('Not authenticated');
  },

  async getAllUsers() {
    const response = await axiosInstance.get('/api/users/all');
    return response.data;
  },

  async getUserById(userId) {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  },

  async updateProfile(userId, data) {
    const response = await axiosInstance.put(`/api/users/${userId}`, data);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await axiosInstance.post('/api/users/forgot-password', { email });
    return response.data;
  },

  async resetPassword(email, otp, newPassword) {
    const response = await axiosInstance.post('/api/users/reset-password', { email, otp, newPassword });
    return response.data;
  },

  async getChatMessages(roomId) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id;
    const response = await axiosInstance.get(`/api/chat/messages/${roomId}`, { params: { userId } });
    return response.data;
  },
};

export default api;
