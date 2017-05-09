import * as api from '../api';

const receivePredictions = (predictions) => ({
  type: 'RECEIVE_PREDICTIONS',
  predictions
});

const receiveUser = (data) => ({
  type: 'RECEIVE_USER',
  data
});

const receiveFeed = (feed) => ({
  type: 'RECEIVE_FEED',
  feed
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
 
export const fetchPredictions = () =>
  api.fetchPredictions().then(response => {
    return receivePredictions(response.data);
  })

export const fetchProfile = (id) =>
  api.fetchProfile(id).then(response => {
    return receiveProfile(response.data);
  })

export const fetchFeed = () =>
  api.fetchFeed().then(response => {
    return receiveFeed(response.data);
  })

export const fetchAll = () =>
  api.fetchAll().then(response => {
    return receiveAll(response.data);
  })