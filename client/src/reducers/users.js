import _find from 'lodash/find';
import { range as d3Range } from 'd3-array';


const ITEM_WIDTH = 350;
const GRID_PADDING = 20;

/*
[
  {
    id,
    feed: [{
          url,
          colIndex,
          top
        }],
    predictions,
    loading
  }
]
*/

export default (state = null, action) => {
  switch(action.type) {
    case 'RECEIVE_ALL_USERS':
      return action.data;
    case 'RECEIVE_FEED':
      return receiveFeed(state, action);
    case 'SET_FEED_ITEM_HEIGHT':
      return setFeedItemPosition(state, action);
    case 'RESET_FEED':
      return resetFeed(state, action);
    case 'SET_PROFILE_VISITED':
      return setProfileVisited(state, action);
    default:
      return state;
  }
}

function applyToUser(state, profileId, fn) {
  if(!state) return null;
  return state.map((user) => {
    if(user.id !== profileId) return user;
    return fn(user);
  });  
}

function setProfileVisited(state, { profileId }) {
  return applyToUser(state, profileId, (user) => {
    return {
      ...user,
      visited: true
    }
  });
}


function resetFeed(state, {profileId}) {
  if(!state) return null;
  return state.map((user) => {
    if(user.id !== profileId) return user;
    if(!user.feed)
      return {
        ...user,
        loading: true
      }

    let feed = user.feed.map((item) => {
      return {
        ...item,
        height: undefined
      }
    });

    return {
      ...user,
      feed,
      loading: true
    };
  });  
}

function receiveFeed(state, {data, id}) {
  // if there's no users yet simply put the new user in a new array
  if(state === null)
    return [{
      id: id,
      feed: data,
      loading: true
    }];
  // else replaces the received user with the one in state
  return state.map((user) => {
    if(user.id !== id) return user;
    return {
      ...user,
      feed: data,
      loading: true
    };
  });
}

function setFeedItemPosition(state, {height, itemUrl, profileId}) {
  return state.map((user) => {
    if(user.id !== profileId) return user;
    const loadedItems = getLoadedItems(user.feed);
    // const loading = ((user.feed.length - 1) !== loadedItems.length) || ((user.feed.length) !== loadedItems.length);
    const loading = (loadedItems.length + 1) < user.feed.length;
    let feed = user.feed.map((item) => {
      if(item.url !== itemUrl) return item;
      const {x, y} = generateScatterPosition(item, height, user.feed);

      return {
        ...item,
        x,
        y,
        height
      }
    });

    return {
      ...user,
      feed,
      loading
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