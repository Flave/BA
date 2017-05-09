import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';

class Profile extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { store } = this.context;
    const { user } = store.getState();

    return (
      <div>
        <Link to="/">Other People</Link>
        <h1>Your Internet</h1>
        {this.createPredictions(profile)}
        {this.createFeed(profile)}
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default Profile;