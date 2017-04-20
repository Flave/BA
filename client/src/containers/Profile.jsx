import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fetchPredictions, fetchProfile } from '../api';
import { receivePredictions, receiveProfile } from '../actions';

class Profile extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });

    fetchProfile().then((response) => {
      console.log(response);
      store.dispatch(receiveProfile(response.data));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleClick = () => {
    const {store} = this.context;
    fetchPredictions().then((response) => {
      console.log(response);
      store.dispatch(receivePredictions(response.data.predictions));
    });
  }

  createPredictionsButton() {
    const { store } = this.context;
    const state = store.getState();
    if(state.profile && state.profile.predictions)
      return undefined;
    return <button onClick={this.handleClick}>Make personality analysis</button>
  }

  createPredictions() {
    const { store } = this.context;
    const state = store.getState();

    if(state.profile && state.profile.predictions)
      return state.profile.predictions.map((prediction, key) => {
        return (
          <div key={key}>
            <span>{prediction.trait}: </span>
            <span>{prediction.value}</span>
          </div>
        )
      })
  }

  render() {
    return (
      <div>
        <h1>This is the profile page!!!</h1>
        {this.createPredictions()}
        {this.createPredictionsButton()}
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default Profile;