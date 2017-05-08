import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Intro from './containers/Intro.jsx';
import Profile from './containers/Profile.jsx';
import Others from './containers/Others.jsx';
import *  as actions from './actions';

import {
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

class App extends Component {
  componentDidMount() {
    var { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });

    store.dispatch(actions.fetchProfile());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const state = this.context.store.getState();
    const { profile } = state;
    
    if(!profile || !profile.login) {
      return <Route path="/" component={Intro} />
    } else {
      return (
        <div>
          <Route path="/" exact component={Profile} />
          <Route path="/others" exact component={Others} />
          <Route path="/someone/:userId" component={Profile} />
        </div>
      )
    }
  }
}

App.contextTypes = {
  store: PropTypes.object
}

export default App;