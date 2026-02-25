import axios from 'axios';

const api = axios.create({
   baseURL: 'https://vetra-api-7w3x.onrender.com',
      // baseURL: 'http://localhost:3000', // Use esta linha para desenvolvimento local
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;