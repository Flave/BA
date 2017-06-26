import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import _find from 'lodash/find';
import _uniqBy from 'lodash/uniqBy';
import SourcesVis from 'app/components/profile-sources/SourcesVis.jsx';

import {
  withRouter
} from 'react-router-dom';


class ProfileSubs extends Component {

  componentDidMount() {
    const { store } = this.context;
    const { users } = store.getState();
    const profileId = this.props.match.params.id;
    const profile = _find(users, {id: profileId});
  }

  getSubs(user, profile) {
    let allSubs = _uniqBy(profile.subs.concat(user.subs), 'id');
    return allSubs.map(sub => {
      const profileHasIt = _find(profile.subs, {id: sub.id});
      const userHasIt = _find(user.subs, {id: sub.id});
      let subscriber = 2;
      if(profileHasIt) subscriber = 0;
      if(profileHasIt && userHasIt) subscriber = 1;
      return {
        ...sub,
        subscriber
      }
    });
  }

  getSubCounts(subs) {
    const counts = [0, 0, 0];
    subs.forEach(sub => counts[sub.subscriber]++)
    return counts;
  }

  render() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();
    const { match } = this.props;
    const profile = _find(users, {id: match.params.id});
    const userProfile = _find(users, {id: user.login});
    const isUser = (user.login === profile.id);
    const subs = isUser ? userProfile.subs : this.getSubs(userProfile, profile);
    

    return (
      <div>
        <SourcesVis
          dimensions={ui.windowDimensions} 
          subs={subs}
          counts={this.getSubCounts(subs)}
          isUser={isUser} />
      </div>
    )
  }
};

ProfileSubs.contextTypes = {
  store: PropTypes.object
}

export default withRouter(ProfileSubs);