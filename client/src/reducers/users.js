
export default (state = null, action) => {
  switch(action.type) {
    case 'RECEIVE_ALL_USERS':
      return action.data;
    case 'RECEIVE_FEED':
      return receiveFeed(state, action);
    default:
      return state;
  }
}

function receiveFeed(state, {data, id}) {
  // if there's no users yet simply put the new user in a new array
  if(state === null)
    return [data];
  // else replaces the received user with the one in state
  return state.map((user) => {
    if(user._id !== id) return user;
    return {
      ...user,
      feed: data
    };
  });
}