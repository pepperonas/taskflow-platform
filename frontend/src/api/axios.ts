import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    
    // Handle authentication errors (401 Unauthorized)
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Small delay to allow error message to be displayed
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
      return Promise.reject(error);
    }
    
    // Handle forbidden errors (403) - might be due to invalid/expired token
    // Check if the error message indicates authentication issues
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '';
      // If it's an authentication-related 403, treat it like 401
      if (errorMessage.includes('Authentication') || 
          errorMessage.includes('authenticated') ||
          errorMessage.includes('token') ||
          errorMessage.includes('login')) {
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Small delay to allow error message to be displayed
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
