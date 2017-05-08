import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Intro from './containers/Intro.jsx';
import Profile from './containers/Profile.jsx';
import Others from './containers/Others.jsx'

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
    
    if(!login) {
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