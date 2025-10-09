
// services/api.js - Fixed version
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Use window.location for hard redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Return a consistent error format
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);





export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resendOtp: (email) => api.post('/auth/resend-otp', { email }),
  getMe: () => api.get('/auth/me'),
  updatePreferences: (preferences) => api.put('/auth/preferences', preferences),
  
  // Password reset
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyResetOtp: (email, otp) => api.post('/auth/verify-reset-otp', { email, otp }),
  resetPassword: (resetToken, newPassword) => api.post('/auth/reset-password', { resetToken, newPassword }),
};


// Book API
export const bookAPI = {
  getUserBooks: (page = 1, limit = 20) => 
    api.get('/books', { params: { page, limit } }),
  
  getBook: (id) => api.get(`/books/${id}`),
  
  createBook: (bookData) => api.post('/books', bookData),
  
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  
  deleteBook: (id) => api.delete(`/books/${id}`),
  
  addCollaborator: (bookId, userId, role) => 
    api.post(`/books/${bookId}/collaborators`, { userId, role }),
  
  removeCollaborator: (bookId, userId) => 
    api.delete(`/books/${bookId}/collaborators/${userId}`),
};

// Pages API
export const pageAPI = {
  getBookPages: (bookId) => api.get(`/pages/book/${bookId}`),
  
  updatePage: (bookId, pageId, pageData) => 
    api.put(`/pages/${pageId}/book/${bookId}`, pageData),
  
  addPageSpread: (bookId, spreadData) => 
    api.post(`/pages/book/${bookId}/spread`, spreadData),
  
  deletePage: (bookId, pageId) => 
    api.delete(`/pages/${pageId}/book/${bookId}`),
};

// Upload API
export const uploadAPI = {
  uploadBackground: (formData) => 
    api.post('/uploads/background', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};



// services/api.js में ये function add करें (file के end में)
export const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Ensure the path starts with /uploads
  const normalizedPath = path.startsWith('/uploads') ? path : `/uploads${path}`;
  return `http://localhost:5000${normalizedPath}`;
};



export default api;
