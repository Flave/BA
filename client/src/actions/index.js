import * as api from '../api';

const receiveUser = (data) => ({
  type: 'RECEIVE_USER',
  data
});

const receiveAll = (data) => ({
  type: 'RECEIVE_ALL',
  data
});

const receiveProfile = (data) => ({
  type: 'RECEIVE_PROFILE',
  data
});


export const fetchUser = () => {
  return api.fetchUser().then(response => {
    return receiveUser(response.data);
  })
}

export const fetchAll = () =>
  api.fetchAll().then(response => {
    return receiveAll(response.data);
  })

export const fetchProfile = (id) =>
  api.fetchProfile(id).then(response => {
    return receiveProfile(response.data);
  })