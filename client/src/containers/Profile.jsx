import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import FacebookPost from '../components/FacebookPost.jsx';

class Profile extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });

    store.dispatch(actions.fetchProfile());
    store.dispatch(actions.fetchFeed());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleClick = () => {
    const {store} = this.context;
    store.dispatch(actions.fetchPredictions());
  }

  createPredictionsButton() {
    const { store } = this.context;
    const state = store.getState();
    if(state.profile && state.profile.predictions.length)
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

  createFeed() {
    const { store } = this.context;
    const state = store.getState();
    if(state.profile && state.profile.feed) {
      return state.profile.feed.map((feedItem, index) => {
        return (
          <div key={index}>
            <FacebookPost key={index} url={feedItem.url}/>
          </div>
        )
      })
    }
  }

  render() {
    return (
      <div>
        <Link to="/others">Other People</Link>
        <h1>Your Internet</h1>
        {this.createPredictions()}
        {this.createPredictionsButton()}
        {this.createFeed()}
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default Profile;