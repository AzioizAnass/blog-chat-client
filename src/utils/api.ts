import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const publicRoutes = ['/api/auth/signin', '/api/auth/signup'];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && !publicRoutes.includes(config.url!)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
