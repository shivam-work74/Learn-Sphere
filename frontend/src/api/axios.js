// src/api/axios.js
import axios from 'axios';

// This logic now sets the baseURL to the root of the server
const API = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://learnsphere-backend-g86a.onrender.com' // Production URL (no /api)
    : 'http://localhost:5000',                       // Development URL (no /api)
});

export default API;