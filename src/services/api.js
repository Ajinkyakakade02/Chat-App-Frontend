import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://nova-chat-backend.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = {
  // Auth
  async login(phoneNumber, password) {
    const response = await axiosInstance.post('/api/users/login', { phoneNumber, password });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async register(fullName, email, phoneNumber, password) {
    const response = await axiosInstance.post('/api/users/register', {
      fullName, email, phoneNumber, password
    });
    localStorage.setItem('user', JSON.stringify(response.data));
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

  // Users
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

  async setPassword(userId, password) {
    const response = await axiosInstance.post(`/api/users/${userId}/set-password`, { password });
    return response.data;
  },

  // OTP
  async sendOTP(phoneNumber) {
    const response = await axiosInstance.post('/api/users/send-otp', { phoneNumber });
    return response.data;
  },

  async verifyOTP(phoneNumber, otp) {
    const response = await axiosInstance.post('/api/users/verify-otp', { phoneNumber, otp });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  // Chat
  async getChatMessages(roomId) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id;
    const response = await axiosInstance.get(`/api/chat/messages/${roomId}`, {
      params: { userId }
    });
    return response.data;
  },
};

export default api;
