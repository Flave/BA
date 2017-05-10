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

export const fetchFeed = (id) => {
  return get(`/api/feed/${id}`);
}

export const fetchAll = () => {
  return get('/api/all');
}

export const fetchOneUser = (id) => {
  return get(`/api/user/${id}`);
}