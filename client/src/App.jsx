import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Intro from './containers/Intro.jsx';
import Profile from './containers/Profile.jsx';
import Others from './containers/Others.jsx';
import *  as actions from './actions';
import _throttle from 'lodash/throttle';

import {
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

const handleResize = _throttle((store) => {
  store.dispatch(actions.setWindowDimensions([window.innerWidth, window.innerHeight]));
}, 800, {leading: false});

class App extends Component {
  componentDidMount() {
    var { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });

    store.dispatch(actions.fetchUser());

    window.addEventListener('resize', handleResize.bind(null, store));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const state = this.context.store.getState();
    const { user } = state;
    const redirectTo = localStorage.getItem("redirectTo");
    const currentPath = window.location.pathname;
    
    // if no user is logged in and path is not "home", redirect to login and save path
    // for later retrieval
    if((!user || !user.login) && currentPath !== "/") {
      localStorage.setItem("redirectTo", currentPath);
      return <Redirect from={currentPath} to="/" />
    } else if(!user || !user.login) {
      return <Route path="/" component={Intro} />
    } else if(redirectTo) {
      localStorage.removeItem("redirectTo");
      return <Redirect from="/" to={redirectTo} />
    }
    else {
      return (
        <div>
          <Route path="/" exact component={Others} />
          <Route path="/someone/:id" component={Profile} />
        </div>
      )
    }
  }
}

App.contextTypes = {
  store: PropTypes.object
}

export default withRouter(App);