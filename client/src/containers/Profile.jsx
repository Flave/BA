import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import _find from 'lodash/find';
import Drawer from 'app/components/Drawer.jsx';
import Sidebar from 'app/components/profile/Sidebar.jsx';
import Feed from 'app/components/profile/Feed.jsx';
import PredictionsDrawer from 'app/components/profile/PredictionsDrawer.jsx';
import SettingsDrawer from 'app/components/profile/SettingsDrawer.jsx';
import SourcesDrawer from 'app/components/profile/SourcesDrawer.jsx';
import ComparisonDrawer from 'app/components/profile/ComparisonDrawer.jsx';
import * as api from '../api';

import {
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

    store.dispatch(actions.resetFeed(profileId));
    store.dispatch(actions.setProfileVisited(profileId));

    // Bit of an annoying way to make sure the necessary things are
    // being loaded but not too much
    if(!userProfile || !userProfile.platforms)
      store.dispatch(actions.fetchProfile(user.login));
    if((!profile || !profile.platforms) && !isMe)
      store.dispatch(actions.fetchProfile(profileId));
    if(!profile || !profile.feed)
      store.dispatch(actions.fetchFeed(profileId));
  }

  handleMenuClick(menuId) {
    this.context.store.dispatch(actions.toggleDrawer(menuId));
  }

  handleLoadMoreClick() {
    this.context.store.dispatch(actions.showMoreItems())
  }

  render() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();
    const { match } = this.props;
    const profile = _find(users, {id: match.params.id});
    const me = _find(users, {id: user.login});
    let isMe = false;


    if(!profile || !profile.feed) return <div>Loading Profile</div>;

    isMe = (user.login === profile.id);

    return (
      <div
      onClick={() => {
       /* api.fetchTest().then((res) => console.log(res)); 
        console.log('fetched');*/
      }}>
        <Sidebar 
          profile={profile} 
          isMe={isMe} 
          onMenuClick={this.handleMenuClick.bind(this)} 
          drawer={ui.drawer} 
          offset={DRAWER_WIDTH}
          />
        <Drawer width={DRAWER_WIDTH} isOpen={ui.drawer}>
          {(ui.drawer === 'predictions') && <PredictionsDrawer />}
          {(ui.drawer === 'user_settings') && <SettingsDrawer user={me} currentPath={match.url} />}
          {(ui.drawer === 'profile_sources') && <SourcesDrawer user={me} />}
          {(ui.drawer === 'profile_comparison') && <ComparisonDrawer />}
        </Drawer>
        <Feed itemsShown={ui.itemsShown} profile={profile} />
        <div
          className="btn btn--raised btn--load-more" 
          onClick={this.handleLoadMoreClick.bind(this)}>Load More</div>
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Profile);