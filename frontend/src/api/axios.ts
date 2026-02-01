import axios from 'axios';

// In production, use relative URL (nginx proxies /api to backend)
// In development, use localhost with explicit port
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Check if we're in production (served from a domain, not localhost dev server)
  if (typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:8082/api';
};

const API_URL = getApiUrl();

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Make axiosInstance available globally for token updates
if (typeof window !== 'undefined') {
  (window as any).axiosInstance = axiosInstance;
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (502, 503, etc.) - don't redirect, let the component handle it
    if (!error.response) {
      return Promise.reject(error);
    }
    
    // Skip auth error handling for login/register endpoints
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                          error.config?.url?.includes('/auth/register');
    
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }
    
    // Check if we're in a "grace period" after login (first 30 seconds)
    const loginTime = sessionStorage.getItem('loginTime');
    const now = Date.now();
    const isGracePeriod = loginTime && (now - parseInt(loginTime)) < 30000;
    
    // Handle authentication errors (401 Unauthorized)
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      
      // Don't redirect if we're on auth pages or if there's no token
      if (!token || currentPath === '/login' || currentPath === '/register') {
        return Promise.reject(error);
      }
      
      // During grace period, don't logout - just log and reject
      if (isGracePeriod) {
        console.warn('401 error during grace period after login, ignoring logout:', error.config?.url);
        return Promise.reject(error);
      }
      
      // Clear token and user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('loginTime');
      // Small delay to allow error message to be displayed
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      return Promise.reject(error);
    }
    
    // Handle forbidden errors (403) - might be due to invalid/expired token
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '';
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      
      // Don't redirect if we're on auth pages or if there's no token
      if (!token || currentPath === '/login' || currentPath === '/register') {
        return Promise.reject(error);
      }
      
      // During grace period, don't logout - just log and reject
      if (isGracePeriod) {
        console.warn('403 error during grace period after login, ignoring logout:', error.config?.url);
        return Promise.reject(error);
      }
      
      // If it's an authentication-related 403, treat it like 401
      if (errorMessage.includes('Authentication') || 
          errorMessage.includes('authenticated') ||
          errorMessage.includes('token') ||
          errorMessage.includes('login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('loginTime');
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
