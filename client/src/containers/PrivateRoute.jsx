import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import Intro from './containers/Intro.jsx';
import {
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

class Profile extends Component {
  componentDidMount() {
    const { store } = this.context;
    const { user } = store.getState();
    const profileId = this.props.match.params.id;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });

    !store.users && store.dispatch(actions.fetchAll());
    store.dispatch(actions.fetchProfile(profileId));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const state = this.context.store.getState();
    const { user } = state;
    const redirectTo = localStorage.getItem("redirectTo");
    const currentPath = window.location.pathname;

    if(user && user.login &&  ) {
    if(user && user.login) {
      localStorage.removeItem("redirectTo");
      return <Redirect from={currentPath} to={redirectTo} />
    } else {
      localStorage.setItem("redirectTo", currentPath);
      return <Intro/>
    }
    
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default Profile;