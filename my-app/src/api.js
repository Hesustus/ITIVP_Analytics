import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const csrf = localStorage.getItem('csrfToken');

  if (token) config.headers.Authorization = `Bearer ${token}`;

  const method = (config.method || 'get').toLowerCase();
  if (csrf && ['post', 'put', 'patch', 'delete'].includes(method)) {
    config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('csrfToken');
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  profile: () => api.get('/profile')
};

export const sitesApi = {
  list: (params) => api.get('/sites', { params }),
  one: (id) => api.get(`/sites/${id}`),
  create: (data) => api.post('/sites', data),
  update: (id, data) => api.put(`/sites/${id}`, data),
  remove: (id) => api.delete(`/sites/${id}`)
};

export default api;