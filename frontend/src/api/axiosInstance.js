// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: "https://one01508552-comp3123-assignment1.onrender.com"
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
