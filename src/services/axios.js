import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('meetuper-jwt') || ''}`,
    timeout: 3000
  }
});

export default axiosInstance;
