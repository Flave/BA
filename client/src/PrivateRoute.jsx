import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Redirect
} from 'react-router-dom'

class PrivateRoute extends Component {
  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { store } = this.context;
    const state = store.getState();
    const { user } = state;
    const { component: Component, ...rest } = this.props;

    if(user) {
      return <Redirect to='/' />
    } else {
        return <Redirect to='/intro'/>
    }    
  }
}

PrivateRoute.contextTypes = {
  store: PropTypes.object
}

export default PrivateRoute;