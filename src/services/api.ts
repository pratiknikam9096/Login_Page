import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  socialAuth: (socialData: any) => api.post('/auth/social', socialData),
  sendOTP: (phone: string) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp }),
  sendMagicLink: (email: string) => api.post('/auth/magic-link', { email }),
  biometricAuth: (email: string, biometricData: string) => 
    api.post('/auth/biometric', { email, biometricData }),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  getAllUsers: () => api.get('/users/all'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;