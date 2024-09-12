import axios from 'axios';
import store from '../store'; // Impor store di sini

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Sesuaikan dengan URL backend Anda
});

// Request interceptor untuk menambahkan token ke header Authorization
api.interceptors.request.use(
  config => {
    const token = store.getters.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk menangani token kadaluarsa
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(import.meta.env.VITE_BASE_URL + '/refresh', {}, {
          headers: { 'Authorization': `Bearer ${store.getters.token}` }
        });
        console.log(store.getters.token)
        const newToken = response.data.token;
        console.log(newToken);
        console.log(response.data);
        store.commit('setToken', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.log('catch error',err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
