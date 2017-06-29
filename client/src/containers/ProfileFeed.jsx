import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import _find from 'lodash/find';
import LoadMoreBtn from 'app/components/profile-feed/LoadMoreBtn.jsx';
import Feed from 'app/components/profile-feed/Feed.jsx';

import {
  withRouter
} from 'react-router-dom';


class Profile extends Component {

  componentDidMount() {
    const { store } = this.context;
    const { users } = store.getState();
    const profileId = this.props.match.params.id;
    const profile = _find(users, {id: profileId});

    // reset feed ui to initial state and set all feed items to loaded: false
    if(profile) 
      store.dispatch(actions.resetFeed(profile));
  }

  handleLoadMoreClick(maxItems, itemsShown) {
    this.context.store.dispatch(actions.showMoreItems())
  }

  render() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();
    const { match } = this.props;
    const profile = _find(users, {id: match.params.id});
    let isMe = false;

    isMe = (user.login === profile.id);

    return (
      <div>
        <Feed 
          itemsShown={ui.itemsShown}
          batchStartIndex={ui.lastItemsShown}
          loading={ui.feedLoading} 
          profile={profile} />
        {!ui.feedLoading && <LoadMoreBtn 
          onClick={this.handleLoadMoreClick.bind(this)}
          more={ui.maxItems > ui.itemsShown} />}
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Profile);