import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import _find from 'lodash/find';
import _uniqBy from 'lodash/uniqBy';
import SourcesVis from 'app/components/profile-sources/SourcesVis.jsx';
import Tooltip from 'app/components/common/Tooltip.jsx';
import { getSubURL } from 'app/utility';
import { ui, platforms } from 'root/constants';

import {
  withRouter
} from 'react-router-dom';

const { DRAWER_WIDTH, SIDEBAR_WIDTH } = ui;

class ProfileSubs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveredSub: null,
      hoveredSubs: []
    }
  }

  componentWillMount() {
    const { users, user } = this.context.store.getState();
    const { match } = this.props;
    const profile = _find(users, {id: match.params.id});
    const userProfile = _find(users, {id: user.login});
    // necessary to cache the subs for better performance
    // could be done without closure though...
    this.getTheSubs = this.getSubs(userProfile, profile);
  }

  componentDidMount() {
    this.bubbles = SourcesVis();
    this.updateVis();
  }

  componentWillUnmount() {
    this.bubbles.destroy();
  }

  // Gets the overlapping subscriptions and returns all
  // subscriptions in a nested array
  getSubs(user, profile) {
    let subs = null;

    return function getTheSubs() {
      if(subs) return subs;
      subs = [[],[],[]];

      let allSubs = _uniqBy(profile.subs.concat(user.subs), 'id');
      allSubs.forEach(sub => {
        const profileHasIt = _find(profile.subs, {id: sub.id});
        const userHasIt = _find(user.subs, {id: sub.id});
        let subscriber = 2;
        if(profileHasIt) subscriber = 0;
        if(profileHasIt && userHasIt) subscriber = 1;
        subs[subscriber].push({...sub});
      });

      subs.forEach(subsGroup => 
        subsGroup.sort((subA, subB) => subB.relevance - subA.relevance)
      )
      return subs;
    }
  }

  componentDidUpdate(prevProps, { hoveredSub }) {
    if(hoveredSub !== this.state.hoveredSub) return;
    this.updateVis();
  }

  updateVis() {
    const subs = this.getTheSubs();
    const { ui } = this.context.store.getState();

    this.bubbles
      .subs(subs)
      .isUser(this.isUser())
      .canvas(this.canvas)
      .size(ui.windowDimensions)
      .margins({left: ui.canvasDimensions.left})
      .on('mouseenter', hoveredSub => this.setState({hoveredSub}))
      .on('mouseleave', () => this.setState({hoveredSub: null}))
      .update();
  }

  createThumbImages() {
    const subs = this.state.hoveredSubs;
    return (
      <div className="subs-vis__thumbs">
        {subs.map((sub, i) => (
          <img key={sub.id} src={sub.thumb} id={`subs-vis__thumb--${sub.id}`} />
        ))}
      </div>
    )
  }

  isUser() {
    const { users, user, ui } = this.context.store.getState();
    const { match } = this.props;
    const profile = _find(users, {id: match.params.id});
    return user.login === profile.id;
  }

  createClusterLabels() {
    const { ui } = this.context.store.getState();
    const { left, width } = ui.canvasDimensions;
    const labelWidth = width / 4;
    const subs = this.getTheSubs();
    const isUser = this.isUser();
    const labels = ["This person's sources", "Common sources", "Your sources"];

    return (
      <div className="subs-vis__labels">
        {subs.map((subsGroup, i) => {
          if(isUser && i !== 1) return;
          const labelText = isUser ? labels[2] : labels[i];
          const style = {
            left: isUser ? left + labelWidth * 2 : left + labelWidth * (i + 1)
          }

          return (
            <div key={i} style={style} className={`subs-vis__label`}>
              <div className="subs-vis__label-text">{labelText}</div>
            </div>
          )
        })}
      </div>
    )
  }

  createTooltip() {
    const { hoveredSub } = this.state;
    const index = this.isUser() ? 2 : hoveredSub.subscriber;
    const copy = ["This person follows", "Both of you follow", "You follow"][index];
    const platform = _find(platforms, {id: hoveredSub.platform});
    const url = getSubURL(hoveredSub);
    const imgStyle = {
      backgroundImage: `url(${hoveredSub.thumb})`
    }

    return (
      <Tooltip modifiers={["source"]} position={{x: hoveredSub.x, y: hoveredSub.y}}>
        <div style={imgStyle} className="tooltip__thumb" />
        <div className="tooltip__copy">
          {copy} <a target="_blank" href={url}><b>{hoveredSub.name}</b></a> on {platform.label}
        </div>
      </Tooltip>
    )
  }

  render() {
    const { ui } = this.context.store.getState();

    return (
      <div>
        <canvas 
          width={ui.windowDimensions[0]} 
          height={ui.windowDimensions[1]}
          ref={canvas => this.canvas = canvas}></canvas>
        {this.createClusterLabels()}
        {this.state.hoveredSub && this.createTooltip()}
        {this.createThumbImages()}
      </div>
    )
  }
};

ProfileSubs.contextTypes = {
  store: PropTypes.object
}

export default withRouter(ProfileSubs);