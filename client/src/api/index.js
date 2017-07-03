import {get, post} from 'axios';

export const fetchLogin = () => {
  return get('/api/login');
}

export const fetchUser = () => {
  return get('/api/user');
}

export const updateUser = (data) => {
  return post('/api/user', data);
}

export const fetchFeed = (id) => {
  return get(`/api/feed/${id}`);
}

export const fetchAll = () => {
  return get('/api/all');
}

export const fetchProfile = (id) => {
  return get(`/api/profile/${id}`);
}