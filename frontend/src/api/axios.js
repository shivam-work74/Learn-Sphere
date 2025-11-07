// src/api/axios.js
import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
           (window.location.hostname === 'localhost' ? 'http://localhost:5000' : ''),
});

// Add a response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      console.error('Network Error: Please check your connection');
    }
    return Promise.reject(error);
  }
);

export default API;