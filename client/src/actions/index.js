import * as api from '../api';

const receiveUser = (data) => ({
  type: 'RECEIVE_USER',
  data
});

const receiveAll = (data) => ({
  type: 'RECEIVE_ALL_USERS',
  data
});

const receiveFeed = (data, id) => ({
  type: 'RECEIVE_FEED',
  data,
  id
});

const receiveOneUser = (data, id) => ({
  type: 'RECEIVE_ONE_USER',
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

export const fetchFeed = (id) =>
  api.fetchFeed(id).then(response => {
    return receiveFeed(response.data, id);
  })

export const fetchOneUser = (id) =>
  api.fetchOneUser(id).then(response => {
    return receiveOneUser(response.data);
  })