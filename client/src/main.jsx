import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ReactDom from 'react-dom';
import App from './App.jsx';
import rootReducer from './reducers';
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom';

const addLoggingToDispatch = (store) => {
  const rawDispatch = store.dispatch;
  if(!console.group) {
    return rawDispatch(action);
  }

  return (action) => {
    console.group(action.type);
    console.log('%c prev state: ', 'color: gray', store.getState());
    console.log('%c action: ', 'color: blue', action);
    const returnValue = rawDispatch(action);
    console.log('%c next state: ', 'color: green', store.getState());
    console.groupEnd(action.type);
    return returnValue;
  }
}

const store = createStore(rootReducer);

/*if(process.env.NODE_ENV !== 'production') {
  store.dispatch = addLoggingToDispatch(store);
}*/


const render = () => ReactDom.render((
  <Provider store={store} >
    <Router>
      <App />
    </Router>
  </Provider>
  ), document.getElementById('react-app')
)

render();