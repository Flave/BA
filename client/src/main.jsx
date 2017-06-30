import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ReactDom from 'react-dom';
import App from './App.jsx';
import rootReducer from './reducers';
import {
  BrowserRouter as Router,
  Route,
  withRouter
} from 'react-router-dom';

require('./style/index.scss');

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

const addPromiseSupportToDispatch = (store) => {
  const rawDispatch = store.dispatch;
  return (action) => {
    if(typeof action.then === 'function') {
      return action
        .then(rawDispatch, err => console.log(err))
        .catch(err => {throw err;})
    }
    return rawDispatch(action);
  }
}

const store = createStore(rootReducer);

if(process.env.NODE_ENV !== 'production') {
  store.dispatch = addLoggingToDispatch(store);
}

store.dispatch = addPromiseSupportToDispatch(store);


const render = () => ReactDom.render((
  <Provider store={store} >
    <Router>
      <App />
    </Router>
  </Provider>
  ), document.getElementById('react-app')
)

render();