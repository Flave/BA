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

export const receiveLogin = (login) => ({
  type: 'RECEIVE_LOGIN',
  login
});

export const fetchProfile = () =>
  api.fetchProfile().then(response => {
    return receiveProfile(response.data);
  })

export const fetchPredictions = () =>
  api.fetchPredictions().then(response => {
    return receivePredictions(response.data);
  })

export const fetchFeed = () =>
  api.fetchFeed().then(response => {
    return receiveFeed(response.data);
  })