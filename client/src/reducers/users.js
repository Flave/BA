import _find from 'lodash/find';
import _omit from 'lodash/omit';
import { range as d3Range } from 'd3-array';
import { randomNormal as d3RandomNormal } from 'd3-random';
import { getFreeSpots } from 'app/utility';


const ITEM_WIDTH = 350;
const GRID_PADDING = 20;

/*
[
  {
    id,
    feed: [{
          id,
          colIndex,
          top,
          height
        }],
    predictions,
    loading,
    platforms,
    feedNeedsInit
  }
]
*/

export default (state = null, action) => {
  switch(action.type) {
    case 'RECEIVE_ALL_USERS':
    return receiveAllUsers(state, action);
    case 'RECEIVE_PROFILE':
      return receiveProfile(state, action);
    case 'RECEIVE_FEED_ITEM':
      return setFeedItemPosition(state, action);
    case 'SET_PROFILE_VISITED':
      return setProfileVisited(state, action);
    case 'RESET_FEED':
      return resetFeed(state, action);
    case 'INITIALIZE_FEED_ITEM':
      return initializeFeedItem(state, action);
    default:
      return state;
  }
}

function applyToProfile(state, id, fn) {
  if(!state) return null;
  return state.map((profile) => {
    if(profile.id !== id) return profile;
    return fn(profile);
  });
}

function setProfileVisited(state, { id }) {
  return applyToProfile(state, id, (profile) => {

    return {
      ...profile,
      visited: true
    }
  });
}

function resetFeed(state, {profile}) {
  return applyToProfile(state, profile.id, (profile) => {
    if(!profile.feed) return profile;
    return {
      ...profile,
      feedNeedsInit: false,
      feed: initializeFeed(profile)
    }
  })
}

// Checks if there is already a user with data
// if not, just returns the actions data if a user is already
// set, it means that the feed request returned before
// the all users request
function receiveAllUsers(state, action) {
  if(!state || !state.length) return action.data;
  return action.data.map(profile => {
    const existingUser = _find(state, {id: profile.id});
    if(existingUser)
      return {
        ...profile,
        ...existingUser
      }
    return profile;
  });
}

// initializes feed and sets necessary profile variables
function receiveProfile(state, { id, data, urlId }) {
  data.feed = initializeFeed(data);
  data.visited = id === urlId;
  data.feedNeedsInit = false;
  // if state not initialized, just wrap the profile in an array
  if(!state) return [data];
  // if profile already exists, just add the received profile data to it
  const containsProfile = _find(state, {id: id}) !== undefined;
  if(containsProfile)
    return applyToProfile(state, id, user => ({
      ...user,
      ...data
    }))
  // else push the new profile data into the state array
  return state.concat(data);
}

// used to initialize whole feed from scratch when receiving profile or when
// navigated to profile
function initializeFeed(profile) {
  const feed = profile.feed.map(item => 
    _omit(item, ['loaded', 'initialized', 'x', 'y', 'colIndex', 'siblingTop'])
  );

  let freeSpots = getFreeSpots({x: 0, y: 0}, {feed});

  return feed.map((item, i) => {
    if(i >= freeSpots.length) return item;

    return {
      ...item,
      ...freeSpots[i],
      loaded: false,
      initialized: true
    }
  })
}

// Function used to initialize individual feed item after pan
function initializeFeedItem(state, {data, id}) {
  const {x, y, colIndex, siblingTop} = data;
  return state.map((profile) => {
    if(profile.id !== id) return profile;
    let uninitializedItem = _find(profile.feed, item => !item.initialized);

    let feed = profile.feed.map((item) => {
      if(item.id !== uninitializedItem.id) return item;

      return {
        ...item,
        x,
        y,
        colIndex,
        siblingTop,
        loaded: false,
        initialized: true
      }
    });

    return {
      ...profile,
      feed,
      feedNeedsInit: true
    };
  });  
}


// Set the definitive position of the item after it is loaded
function setFeedItemPosition(state, {height, item: loadedItem, id}) {
  return state.map((profile) => {
    if(profile.id !== id) return profile;
    let feed = profile.feed.map((item) => {
      if(item.id !== loadedItem.id) return item;

      return {
        ...item,
        height,
        loaded: true,
        y: item.y === null ? (item.siblingTop - height - (Math.random() * 50 + 20)) : item.y
      }
    });

    return {
      ...profile,
      feed
    };
  });  
}