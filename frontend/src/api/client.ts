import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Handle 401 globally — but NOT for auth endpoints (avoids redirect loops)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/me') || url.includes('/auth/login') || url.includes('/admin/login');
    if ((err.response?.status === 401 || err.response?.status === 403) && !isAuthEndpoint) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
