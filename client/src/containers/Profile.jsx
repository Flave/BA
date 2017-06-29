import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import _find from 'lodash/find';
import Drawer from 'app/components/Drawer.jsx';
import Nav from 'app/components/common/Nav.jsx';
import Sidebar from 'app/components/profile-feed/Sidebar.jsx';
import PredictionsDrawer from 'app/components/profile-feed/PredictionsDrawer.jsx';
import SettingsDrawer from 'app/components/profile-feed/SettingsDrawer.jsx';
import ProfileFeed from './ProfileFeed.jsx';
import ProfileSources from './ProfileSources.jsx';
import Loader from 'app/components/common/Loader.jsx';
import * as api from '../api';
import { ui } from 'root/constants';

import {
  Route,
  withRouter
} from 'react-router-dom';

const { DRAWER_WIDTH } = ui;

class Profile extends Component {

  componentDidMount() {
    const { store } = this.context;
    const { users, user } = store.getState();
    const profileId = this.props.match.params.id;
    const profile = _find(users, {id: profileId});
    const userProfile = _find(users, {id: user.login});
    const isUser = user.login === profileId;

    store.dispatch(actions.setProfileVisited(profileId));
    store.dispatch(actions.resetUi());

    // Bit of an annoying way to make sure the necessary things are
    // being loaded but not too much
    if(!userProfile || !userProfile.platforms)
      store.dispatch(actions.fetchProfile(user.login));
    if((!profile || !profile.platforms) && !isUser)
      store.dispatch(actions.fetchProfile(profileId));
  }

  handleMenuClick(menuId) {
    this.context.store.dispatch(actions.toggleDrawer(menuId));
  }

  render() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();
    const { match, location } = this.props;
    const profile = _find(users, {id: match.params.id});
    const userProfile = _find(users, {id: user.login});
    let isUser = false;
    const baseProfilesLoaded = !!(profile && userProfile);
    const fullyLoaded = !!(baseProfilesLoaded && profile.subs && userProfile.subs)

    // base profile could already be loaded so we have to make sure
    // the actual profile with "subs" is loaded
    if(!baseProfilesLoaded) 
      return <Loader copy="Loading Profile"/>;

    isUser = (user.login === profile.id);

    return (
      <div>
        {fullyLoaded && <Route path="/:id/feed" component={ProfileFeed} />}
        {fullyLoaded && <Route path="/:id/sources" component={ProfileSources} />}
        {!fullyLoaded && <Loader copy="Loading Profile"/>}
        <Nav 
          baseUrl={match.url} 
          segments={[{key: "feed", label: "Feed"}, {key: "sources", label: "Sources"}]}/>
        <Sidebar 
          profile={profile} 
          userProfile={userProfile}
          onMenuClick={this.handleMenuClick.bind(this)} 
          drawer={ui.drawer} 
          offset={DRAWER_WIDTH} />
        <Drawer width={DRAWER_WIDTH} isOpen={ui.drawer}>
          {(ui.drawer === 'predictions') && <PredictionsDrawer profile={profile}/>}
          {(ui.drawer === 'user_settings') && <SettingsDrawer user={userProfile} currentPath={location.pathname} />}
        </Drawer>
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Profile);