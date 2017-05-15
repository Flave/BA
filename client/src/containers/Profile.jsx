import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import FacebookPost from '../components/FacebookPost.jsx';
import _find from 'lodash/find';
import Sidebar from '../components/profile/Sidebar.jsx';
import Predictions from '../components/profile/Predictions.jsx';
import Feed from '../components/profile/Feed.jsx';

import {
  withRouter
} from 'react-router-dom';

class Profile extends Component {
  componentDidMount() {
    const { store } = this.context;
    const { users } = store.getState();
    const profileId = this.props.match.params.id;
    const profile = _find(users, {id: profileId});
    !users && store.dispatch(actions.fetchAll());


    store.dispatch(actions.resetFeed(profileId));
    store.dispatch(actions.setProfileVisited(profileId));
    if(!profile || !profile.feed)
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

    if(!profile) return <div/>;

    isMe = (user.login === profile.id);
    return (
      <div>
        <Sidebar isMe={isMe} profile={profile} />
        <Feed profile={profile} />
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Profile);