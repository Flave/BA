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
  return bestCandidateGenerator()(item, height, positionedItems);
}

function bestCandidateGenerator() {
  let tries = 0;

  return function getBestCandidate(item, height, items) {
    let biggestDistance = 0;
    let bestCandidate;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerWidth;
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;

    const candidates = d3Range(50).map((i) => {
      return {
        x: Math.random() * windowWidth - ITEM_WIDTH,
        y: Math.random() * windowHeight - height,
        height: height
      }
    });

    candidates.forEach((candidate) => {
      if(doesItemCollide(candidate, items)) return;
      if(!bestCandidate) bestCandidate = candidate;
      const maxDistance = getMaxDistance(candidate, items);
      if(maxDistance > biggestDistance) {
        bestCandidate = candidate;
        biggestDistance = maxDistance;
      }
    });

    console.log(bestCandidate);

    if(tries > 10)
      return candidates[0];

    if(!bestCandidate) {
      tries++;
      return getBestCandidate(item, height, items, tries);
    }
    return bestCandidate;
  }
}

function doesItemCollide(item1, items) {
  let doesCollide = false;
  items.forEach((item2) => {
    if(doesCollide) return;
    if(
      ((item1.x < (item2.x + ITEM_WIDTH + GRID_PADDING) && (item1.x > (item2.x - GRID_PADDING))) && (item1.y < (item2.y + item2.height + GRID_PADDING) && (item1.y > (item2.y - GRID_PADDING)))) ||
      ((item2.x < (item1.x + ITEM_WIDTH + GRID_PADDING) && (item2.x > (item1.x - GRID_PADDING))) && (item2.y < (item1.y + item1.height + GRID_PADDING) && (item2.y > (item1.y - GRID_PADDING))))
    ) {
      doesCollide = true;
    }
  });
  return doesCollide;
}

function getDistance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;

  return Math.sqrt( dx*dx + dy*dy );
}

function getMaxDistance(candidate, items) {
  let biggestDistance = 0;
  items.forEach((item) => {
    const distance = getDistance(candidate, item);
    if(distance > biggestDistance)
      biggestDistance = distance;
  });
  return biggestDistance;
}



// GRID CALCULATION

function generateGridPosition(item, height, feed) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerWidth;
  const centerIndex = Math.floor(windowWidth / GRID_WIDTH / 2);
  const positionedItems = feed.filter((item) => item.colIndex !== undefined);
  const colIndex = Math.floor(d3RandomNormal(centerIndex, 5)());
  let itemsInCol = positionedItems.filter(item => item.colIndex === colIndex);

  // if there are no items in this column yet, just define a top positions
  if(itemsInCol === undefined || (itemsInCol.length === 0))
    return {
      colIndex: colIndex,
      top: d3RandomNormal(windowHeight/2, 10)() - height/2,
      left: colIndex * GRID_WIDTH + GRID_PADDING/2
    }

  // else calculate top position based on other items in the column
  itemsInCol = sortItemsByTopPos(itemsInCol);
  const topItem = itemsInCol[0];
  const bottomItem = itemsInCol[itemsInCol.length - 1];
  return {
    colIndex: colIndex,
    top: bottomItem.top + bottomItem.height + GRID_PADDING,
    left: colIndex * GRID_WIDTH + GRID_PADDING/2
  }
}

function sortItemsByTopPos(items) {
  return items.sort((a, b) => {
    return a.top - b.top;
  });
}