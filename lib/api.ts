import axios from 'axios';
import { BASE_URL } from '@/app/constant/constant.js';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to home
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
      console.error('Unauthorized access - token may have expired');
    }
    return Promise.reject(error);
  }
);

export default apiClient;