import {get} from 'axios';

export const fetchLogin = () => {
  return get('/api/login');
}

export const fetchPredictions = () => {
  return get('/api/predictions');
}

export const fetchProfile = () => {
  return get('/api/profile');
}

export const fetchFeed = () => {
  return get('/api/feed');
}