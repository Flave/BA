import predictions from 'root/constants/predictions';
import _find from 'lodash/find';

const initialState = {
  windowDimensions: [window.innerWidth, window.innerHeight],
  drawer: null,
  othersPeopleOptions: predictions.map(({ id }) => (
      id === 'age' ? {id, value: true} : {id, value: false}
    )
  )
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
    case 'RESET_UI':
      return {
        ...state,
        drawer: null
      }
    case 'SET_OTHERS_PEOPLE_OPTIONS':
      return {
        ...state,
        othersPeopleOptions: setOthersPeopleOptions(state, action)
      }
    default:
      return state;
  }
}

function setOthersPeopleOptions(state, action) {
  return state.othersPeopleOptions.map((option) => {
    const newOption = _find(action.options, {id: option.id});
    return newOption ? newOption : option;
  });
}