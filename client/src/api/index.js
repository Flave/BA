import axios from 'axios';

export const fetchLogin = () => {
  return axios.get('/api/login');
}

export const fetchPredictions = () => {
  return axios.get('/api/predictions');
}

export const fetchProfile = () => {
  return axios.get('/api/profile');
}