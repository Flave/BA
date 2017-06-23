import predictions from 'root/constants/predictions';
import _find from 'lodash/find';

const initialState = {
  windowDimensions: [window.innerWidth, window.innerHeight],
  drawer: null,
  othersPeopleOptions: predictions.map(({ id }) => (
      id === 'age' ? {id, value: true} : {id, value: false}
    )
  ),
  itemsShown: 2,
  itemsIncrement: 2,
  maxItems: null,
  userCount: Infinity,
  loading: true
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
    case 'RECEIVE_USER':
      return {
        ...state,
        userCount: action.data && action.data.userCount
      }
    case 'SHOW_MORE_ITEMS':
      return {
        ...state,
        itemsShown: increaseItemsShown(state),
        loading: true
      }
    case 'RECEIVE_FEED':
      return {
        ...state,
        maxItems: action.data.length
      }
    case 'RECEIVE_FEED_ITEM':
      return {
        ...state,
        loading: setLoading(state, action)
      }
    default:
      return state;
  }
}

function setLoading(state, { profile }) {
  const loadedItems = profile.feed.filter(item => item.loaded);
  return loadedItems.length < state.itemsShown - 1;
}

function setOthersPeopleOptions(state, action) {
  return state.othersPeopleOptions.map((option) => {
    const newOption = _find(action.options, {id: option.id});
    return newOption ? newOption : option;
  });
}

function increaseItemsShown({ itemsShown, maxItems, itemsIncrement }) {
  return (itemsShown + 2) > maxItems ? maxItems : itemsShown + itemsIncrement;
}