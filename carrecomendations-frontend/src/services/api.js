// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  //baseURL:'/api'
});

// Add request interceptor to include token
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add all your API methods
export default {
  // Auth methods
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  
  // Dashboard method
  getDashboardData: () => api.get('/dashboard'),
  
  // Add other methods as needed
  getPreferences: () => api.get('/preferences'),
  updatePreferences: (userId, preferences) => api.put('/preferences', 
    {userId,
    preferences
  }),
  getRecommendations:(data) => api.post('/recommendations',data),
  addToFavorites:(userId,carId)=>api.post('/addToFavorites',{userId,carId}),
  getCarDetails:(userId,carId)=>api.post('/getCarDetails',{userId,carId}),
  updateUserProfile:(data)=>api.post('/updateUserProfile',data),
  removeFavorite:(userId,carId)=>api.post('/removeFavorite',{userId,carId})
};