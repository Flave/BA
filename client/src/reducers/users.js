export default (state = null, action) => {
  switch(action.type) {
    case 'RECEIVE_ALL':
      return action.data;
    default:
      return state;
  }
}