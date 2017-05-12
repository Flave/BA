import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import FacebookPost from '../components/FacebookPost.jsx';
import _find from 'lodash/find';
import Header from '../components/profile/Header.jsx';
import Predictions from '../components/profile/Predictions.jsx';
import Feed from '../components/profile/Feed.jsx';

class Profile extends Component {
  componentDidMount() {
    const { store } = this.context;
    const { users } = store.getState();
    const profileId = this.props.match.params.id;

    !users && store.dispatch(actions.fetchAll());
    store.dispatch(actions.fetchFeed(profileId));
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

  render() {
    const { store } = this.context;
    const { users, user } = store.getState();
    const { match } = this.props;
    const profile = _find(users, {id: match.params.id});
    let isMe = false;

    if(!profile)
      return <div>Loading</div>

    isMe = (user.login === profile.id);

    return (
      <div>
        <Header isMe={isMe} profile={profile} />
        {/*profile.predictions && this.createPredictions(profile)*/}
        <Feed feed={profile.feed}/>
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default Profile;