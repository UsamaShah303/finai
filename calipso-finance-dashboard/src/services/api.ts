import axios from 'axios';
import { useAuthStore } from '../lib/authStore';

const api = axios.create({
  baseURL: '/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me'); // Changed to /auth/me for Task 1
    return response.data;
  },
  optimizePortfolio: async (amount: number, riskScore: number) => {
    const response = await api.post('/optimize', { amount, riskScore });
    return response.data;
  },
  getWalletBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  },
  depositFunds: async (amount: number, currency: string) => {
    const response = await api.post('/wallet/deposit', { amount, currency });
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/wallet/transactions');
    return response.data;
  },
  autoInvest: async (amount: number, currency: string, riskScore: number) => {
    const response = await api.post('/invest/auto', { amount, currency, riskScore });
    return response.data;
  }
};

export default api;
