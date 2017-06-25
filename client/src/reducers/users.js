import _find from 'lodash/find';
import { range as d3Range } from 'd3-array';


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
    platforms
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
      feed: profile.feed.map(item => ({...item, loaded: false}))
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

function receiveProfile(state, { id, data }) {
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



function setFeedItemPosition(state, {height, item: loadedItem, id}) {
  return state.map((profile) => {
    if(profile.id !== id) return profile;
    let feed = profile.feed.map((item) => {
      if(item.id !== loadedItem.id) return item;
      const {x, y} = generateScatterPosition(item, height, profile.feed);

      return {
        ...item,
        x,
        y,
        height,
        loaded: true
      }
    });

    return {
      ...profile,
      feed
    };
  });  
}


function getLoadedItems(items) {
  return items.filter((item) => item.height !== undefined);
}


// SCATTER CALCULATION

function generateScatterPosition(item, height, positionedItems) {
  return getNewPosition(item, height, positionedItems);
}

/*
  Gets a random position based on the center of the screen that doesn't collide
  with any of the existing positions.
  Can be optimised by taking into account the center item instead of the center position
  and then looking at the outer most items to calculate the initial spread
*/
function getNewPosition(item, height, items) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerWidth;
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  let spread = 0;

  function getPosition() {
    var newPos = {
      x: d3RandomNormal(centerX, spread)() - ITEM_WIDTH/2,
      y: d3RandomNormal(centerY, spread)() - height/2,
      height: height
    }
    if(!doesItemCollide(newPos, items)) {
      return newPos;
    }
    spread += 4;
    return getPosition();
  }

  return getPosition();
}


function doesItemCollide(item1,  items) {
  let doesCollide = false;

  items.forEach((item2) => {
    if(doesCollide) return;
    if(
      ((item2.x > (item1.x - ITEM_WIDTH - GRID_PADDING)) && (item2.x < (item1.x + ITEM_WIDTH + GRID_PADDING))) &&
      ((item2.y > (item1.y - item2.height - GRID_PADDING)) && (item2.y < (item1.y + item1.height + GRID_PADDING)))
    ) {
      doesCollide = true;
    }
  });
  return doesCollide;
}