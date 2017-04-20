import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PrivateRoute from './PrivateRoute.jsx';
import Intro from './containers/Intro.jsx';
import Profile from './containers/Profile.jsx';

import {
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

class App extends Component {
  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const state = this.context.store.getState();
    const { login } = state;
    console.log(login);
    
    if(!login) {
      return <Route path="/" component={Intro} />
    } else {
      return <Route path="/" component={Profile} />
    }
  }
}

App.contextTypes = {
  store: PropTypes.object
}

export default App;