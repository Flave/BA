import { predictions, ui } from 'root/constants';
import _find from 'lodash/find';

const initialState = {
  windowDimensions: [window.innerWidth, window.innerHeight],
  canvasDimensions: {
    width: window.innerWidth - ui.SIDEBAR_WIDTH,
    height: window.innerHeight,
    left: ui.SIDEBAR_WIDTH
  },
  drawer: null,
  othersPeopleOptions: predictions.map(({ id }) => (
      id === 'age' ? {id, value: true} : {id, value: false}
    )
  ),
  itemsShown: 4,
  itemsIncrement: 4,
  maxItems: null,
  userCount: Infinity,

  userLoading: true,
  profileLoading: true,
  feedLoading: true,
  usersLoading: true
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'SET_WINDOW_DIMENSIONS':
      return {
        ...state,
        windowDimensions: action.dimensions
      }

    case 'TOGGLE_DRAWER':
      return toggleDrawer(state, action);

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
        feedLoading: true
      }

    case 'RECEIVE_PROFILE':
      return {
        ...state,
        maxItems: action.data.feed.length
      }

    case 'RECEIVE_FEED_ITEM':
      return {
        ...state,
        feedLoading: setFeedLoading(state, action)
      }

    case 'RESET_FEED':
      return {
        ...state,
        feedLoading: true,
        itemsShown: initialState.itemsShown,
        maxItems: action.profile && action.profile.feed ? action.profile.feed.length : null
      };
    default:
      return state;
  }
}


function toggleDrawer(state, { id }) {
  const drawer = state.drawer === id ? null : id;
  const left = drawer ? ui.DRAWER_WIDTH : ui.SIDEBAR_WIDTH;
  return {
    ...state,
    drawer: drawer,
    canvasDimensions: {
      width: state.windowDimensions[0] - left,
      height: state.windowDimensions[1],
      left
    }
  }
}

function setFeedLoading(state, { profile }) {
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
  return (itemsShown + itemsIncrement) > maxItems ? maxItems : itemsShown + itemsIncrement;
}