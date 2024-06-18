import axios from 'axios';

// Buat instance Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // ganti dengan URL API Laravel Anda
  withCredentials: true, // memastikan cookie dikirim dalam setiap request
});

// Tambahkan interceptor untuk menambahkan Authorization header
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor untuk menangani refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/refresh', {}, { withCredentials: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token gagal:', refreshError);
        // Jika refresh token gagal, redirect ke halaman login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
