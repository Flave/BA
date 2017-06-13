const defaultState = {
  options: [
    {
      id: 'age',
      groupId: 'general',
      value: true
    }
  ]
}

export default (state = null, action) => {
  switch(action.type) {
    case 'SET_OPTIONS':
      return action.data;
    default:
      return state;
  }
}