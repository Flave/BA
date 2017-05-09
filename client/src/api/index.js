import {get} from 'axios';

export const fetchLogin = () => {
  return get('/api/login');
}

export const fetchPredictions = () => {
  return get('/api/predictions');
}

export const fetchUser = () => {
  return get('/api/user');
}

export const fetchFeed = () => {
  return get('/api/feed');
}

export const fetchAll = () => {
  return get('/api/all');
}

export const fetchProfile = (id) => {
  return get(`/api/profile/${id}`);
}