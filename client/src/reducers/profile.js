export default (state = {}, action) => {
  switch(action.type) {
    case 'RECEIVE_PROFILE':
      return action.data
    default:
      return state;
  }
}