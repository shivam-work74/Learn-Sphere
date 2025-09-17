// src/api/axios.js
import axios from 'axios';

// This is the final, correct setup.
// In production (Vercel), it uses the URL you provide.
// In development (localhost), it uses the Vite proxy.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default API;