import * as api from '../api';

// API
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

const receiveProfile = (data, id) => ({
  type: 'RECEIVE_PROFILE',
  data,
  id
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

export const fetchProfile = (id) =>
  api.fetchProfile(id).then(response => {
    return receiveProfile(response.data, id);
  })



// UI
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

export const setOthersPeopleOptions = (options) => ({
  type: 'SET_OTHERS_PEOPLE_OPTIONS',
  options
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