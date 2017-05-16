import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import _find from 'lodash/find';
import Drawer from '../components/Drawer.jsx';
import Sidebar from '../components/profile/Sidebar.jsx';
import Feed from '../components/profile/Feed.jsx';
import Predictions from '../components/profile/Predictions.jsx';
import Options from '../components/profile/Options.jsx';

import {
  withRouter
} from 'react-router-dom';

const DRAWER_WIDTH = 350;
const drawerContent = {
  options: Options,
  predictions: Predictions
}


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

    if(!profile) return <div/>;

    isMe = (user.login === profile.id);

    return (
      <div>
        <Sidebar 
          profile={profile} 
          isMe={isMe} 
          onMenuClick={this.handleMenuClick.bind(this)} 
          drawer={ui.drawer} 
          offset={DRAWER_WIDTH} />
        <Drawer width={DRAWER_WIDTH} isOpen={ui.drawer}>
          {(ui.drawer === 'options') && <Options />}
          {(ui.drawer === 'predictions') && <Predictions profile={profile} isMe={isMe} />}
        </Drawer>
        <Feed profile={profile} />
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Profile);