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


export const setWindowDimensions = (dimensions) => ({
  type: 'SET_WINDOW_DIMENSIONS',
  dimensions
});

export const toggleDrawer = (id) => ({
  type: 'TOGGLE_DRAWER',
  id
});

export const setFeedItemHeight = (height, itemUrl, profileId) => ({
  type: 'SET_FEED_ITEM_HEIGHT',
  height,
  itemUrl,
  profileId
});

export const resetFeed = (profileId) => ({
  type: 'RESET_FEED',
  profileId
});

export const resetUi = () => ({
  type: 'RESET_UI'
});

export const setProfileVisited = (profileId) => ({
  type: 'SET_PROFILE_VISITED',
  profileId
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