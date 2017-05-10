import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import FacebookPost from '../components/FacebookPost.jsx';
import _find from 'lodash/find';

class Profile extends Component {
  componentDidMount() {
    const { store } = this.context;
    const { user } = store.getState();
    const profileId = this.props.match.params.id;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });

    !store.users && store.dispatch(actions.fetchAll());
    store.dispatch(actions.fetchFeed(profileId));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  createPredictions({ predictions }) {
    return predictions.map((prediction, key) => {
      return (
        <div key={key}>
          <span>{prediction.trait}: </span>
          <span>{prediction.value}</span>
        </div>
      )
    })
  }

  createFeed({ feed }) {
    return feed.map((feedItem, index) => {
      return (
        <div key={index}>
          <FacebookPost key={index} url={feedItem.url}/>
        </div>
      )
    })
  }

  render() {
    const { store } = this.context;
    const { users } = store.getState();
    const { match } = this.props;
    const user = _find(users, {_id: match.params.id});
    if(!user)
      return <div>Loading</div>

    return (
      <div>
        <Link to="/">Other People</Link>
        <br/>
        <a href="/connect/twitter">Connect to Twitter</a>
        <h1>The Internet of {user._id}</h1>
        {user.predictions && this.createPredictions(user)}
        {user.feed && this.createFeed(user)}
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default Profile;