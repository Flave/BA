const initialState = {
  windowDimensions: [window.innerWidth, window.innerHeight],
  drawerId: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'SET_WINDOW_DIMENSIONS':
      return {
        ...state,
        windowDimensions: action.dimensions
      }
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        drawer: state.drawer === action.id ? null : action.id
      }
    default:
      return state;
  }
}