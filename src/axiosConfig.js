import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/', // Update backend URL and port
});

export default axiosInstance;
