import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    timeout: 3000
  }
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('meetuper-jwt') || '';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
