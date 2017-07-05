import * as api from '../api';

// API
const receiveUser = (data) => ({
  type: 'RECEIVE_USER',
  data
});

const receiveUpdatedUser = (data) => ({
  type: 'RECEIVE_UPDATED_USER',
  data
});

const receiveAll = (data) => ({
  type: 'RECEIVE_ALL_USERS',
  data
});

const receiveProfile = (data, id) => ({
  type: 'RECEIVE_PROFILE',
  data,
  id
});


const receiveError = (data) => ({
  type: 'RECEIVE_ERROR',
  data
});

export const fetchUser = () => {
  return api.fetchUser().then(response => {
    //if(response.status === "ok")
      return receiveUser(response.data);
    //return receiveError(response.data);
  })
}

export const fetchAll = () =>
  api.fetchAll().then(response => {
    return receiveAll(response.data);
  })

export const fetchProfile = (id) =>
  api.fetchProfile(id).then(response => {
    return receiveProfile(response.data, id);
  })

export const updateUser = (data) =>
  api.updateUser(data).then(response => {
    return receiveUpdatedUser(response.data);
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

export const setFeedItemHeight = (height, itemId, id) => ({
  type: 'SET_FEED_ITEM_HEIGHT',
  height,
  itemId,
  id
});

export const receiveFeedItem = (item, height, id, profile) => ({
  type: 'RECEIVE_FEED_ITEM',
  item,
  height,
  id,
  profile
});

export const setOthersPeopleOptions = (options) => ({
  type: 'SET_OTHERS_PEOPLE_OPTIONS',
  options
});

export const showMoreItems = (dimensions) => ({
  type: 'SHOW_MORE_ITEMS'
});

export const resetFeed = (profile) => ({
  type: 'RESET_FEED',
  profile
});

export const resetUi = (data) => ({
  type: 'RESET_UI',
  data
});

export const setProfileVisited = (id) => ({
  type: 'SET_PROFILE_VISITED',
  id
});

export const nextOnboarding = (id) => ({
  type: 'NEXT_ONBOARDING'
});

export const completeOnboarding = (id) => ({
  type: 'COMPLETE_ONBOARDING'
});