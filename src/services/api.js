import axios from 'axios';

const api = axios.create({
  // This uses the variable you set in the Vercel dashboard
  baseURL: `${process.env.REACT_APP_API_URL}/api`, 
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptor to add the token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;