import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/'

const apiClient = axios.create({
  baseURL,
  timeout: 10000000,
})

apiClient.interceptors.request.use((config) => {
  // Skip authentication for payment endpoints
  if (config.url?.includes('/razorpay/')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    return config;
  }

  const token = localStorage.getItem('token');

  // Only set Content-Type if not sending FormData
  const isFormData = config.data && typeof config.data === 'object' && config.data.constructor && config.data.constructor.name === 'FormData';
  config.headers.Accept = 'application/json';
  if (!isFormData) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
    }

    return Promise.reject(error)
  },
)

export default apiClient
