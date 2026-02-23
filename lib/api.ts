import axios from 'axios';
import { BASE_URL } from '@/app/constant/constant';
import { clearAuthToken, getAuthToken } from '@/lib/auth-token';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for sending cookies with requests
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
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
      const isLoginEndpoint = error.config?.url?.includes('/auth/login');
      // Only clear the token when an authenticated request fails (not on login itself,
      // where 401 means wrong credentials and is handled by the form's catch block)
      if (!isLoginEndpoint && getAuthToken()) {
        clearAuthToken();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;