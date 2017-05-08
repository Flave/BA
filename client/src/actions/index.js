import * as api from '../api';

const receivePredictions = (predictions) => ({
  type: 'RECEIVE_PREDICTIONS',
  predictions
});

const receiveProfile = (profile) => ({
  type: 'RECEIVE_PROFILE',
  profile
});

const receiveFeed = (feed) => ({
  type: 'RECEIVE_FEED',
  feed
});

const receiveLogin = (login) => ({
  type: 'RECEIVE_LOGIN',
  login
});

const receiveAll = (all) => ({
  type: 'RECEIVE_ALL',
  all
});

export const fetchLogin = () =>
  api.fetchLogin().then(response => {
    return receiveLogin(response.data);
  })

export const fetchProfile = () => {
  return api.fetchProfile().then(response => {
    return receiveProfile(response.data);
  }) 
}
 
export const fetchPredictions = () =>
  api.fetchPredictions().then(response => {
    return receivePredictions(response.data);
  })

export const fetchFeed = () =>
  api.fetchFeed().then(response => {
    return receiveFeed(response.data);
  })

export const fetchAll = () =>
  api.fetchAll().then(response => {
    return receiveAll(response.data);
  })