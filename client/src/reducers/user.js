export default (state = null, action) => {
  switch(action.type) {
    case 'RECEIVE_USER':
      return action.data;
    default:
      return state;
  }
}