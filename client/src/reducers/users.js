import _find from 'lodash/find';

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
    case 'UPDATE_FEED_POSITIONS':
      return updateFeedPositions(state, action);
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

// takes an array of items from a user with positions
function updateFeedPositions(state, {data, userId}) {
  return state.map((user) => {
    if(user.id !== id) return user;
    let feed = user.feed.map((item) => {
      const {colIndex, top} = _find(data, (newItem) => {
        newItem.url === item.url
      });
      return {
        ...item,
        colIndex,
        top
      }
    });

    return {
      ...user,
      feed
    };
  });
}