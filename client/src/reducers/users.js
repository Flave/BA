import _find from 'lodash/find';
import { range as d3Range } from 'd3-array';


const GRID_WIDTH = 360;
const ITEM_WIDTH = 350;
const GRID_PADDING = 20;

/*
[
  {
    id,
    feed: {
      url,
      colIndex,
      top
    },
    predictions
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
    default:
      return state;
  }
}

function receiveFeed(state, {data, id}) {
  // if there's no users yet simply put the new user in a new array
  if(state === null)
    return [{
      id: id,
      feed: data
    }];
  // else replaces the received user with the one in state
  return state.map((user) => {
    if(user.id !== id) return user;
    return {
      ...user,
      feed: data
    };
  });
}

function setFeedItemPosition(state, {height, itemUrl, profileId}) {
  return state.map((user) => {
    if(user.id !== profileId) return user;
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
      feed
    };
  });  
}


// SCATTER CALCULATION

function generateScatterPosition(item, height, feed) {
  const positionedItems = feed.filter((item) => item.x !== undefined);
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