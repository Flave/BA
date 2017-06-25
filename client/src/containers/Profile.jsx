import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import _find from 'lodash/find';
import Drawer from 'app/components/Drawer.jsx';
import Sidebar from 'app/components/profile-feed/Sidebar.jsx';
import PredictionsDrawer from 'app/components/profile-feed/PredictionsDrawer.jsx';
import SettingsDrawer from 'app/components/profile-feed/SettingsDrawer.jsx';
import SourcesDrawer from 'app/components/profile-feed/SourcesDrawer.jsx';
import ProfileFeed from './ProfileFeed.jsx';
import ProfileSources from './ProfileSources.jsx';
import Loader from 'app/components/common/Loader.jsx';
import * as api from '../api';

import {
  Route,
  withRouter
} from 'react-router-dom';

const DRAWER_WIDTH = 350;

class Profile extends Component {

  componentDidMount() {
    const { store } = this.context;
    const { users, user } = store.getState();
    const profileId = this.props.match.params.id;
    const profile = _find(users, {id: profileId});
    const userProfile = _find(users, {id: user.login});
    const isMe = user.login === profileId;

    // reset feed ui to initial state and set all feed items to loaded: false
    if(profile)
      store.dispatch(actions.resetFeed(profile));

    store.dispatch(actions.setProfileVisited(profileId));

    // Bit of an annoying way to make sure the necessary things are
    // being loaded but not too much
    if(!userProfile || !userProfile.platforms)
      store.dispatch(actions.fetchProfile(user.login));
    if((!profile || !profile.platforms) && !isMe)
      store.dispatch(actions.fetchProfile(profileId));
  }

  handleMenuClick(menuId) {
    this.context.store.dispatch(actions.toggleDrawer(menuId));
  }

  render() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();
    const { match } = this.props;
    const profile = _find(users, {id: match.params.id});
    const me = _find(users, {id: user.login});
    let isMe = false;

    if(!profile) return <Loader copy="Loading profile"/>;

    isMe = (user.login === profile.id);

    return (
      <div>
        <Route path="/:id/feed" component={ProfileFeed} />
        <Route path="/:id/sources" component={ProfileSources} />
        <Sidebar 
          profile={profile} 
          isMe={isMe}
          onMenuClick={this.handleMenuClick.bind(this)} 
          drawer={ui.drawer} 
          offset={DRAWER_WIDTH} />
        <Drawer width={DRAWER_WIDTH} isOpen={ui.drawer}>
          {(ui.drawer === 'predictions') && <PredictionsDrawer />}
          {(ui.drawer === 'user_settings') && <SettingsDrawer user={me} currentPath={match.url} />}
          {(ui.drawer === 'profile_sources') && <SourcesDrawer user={me} />}
        </Drawer>
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Profile);