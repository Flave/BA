import React, { Component } from 'react';
import platforms from 'root/constants/platforms';
import _find from 'lodash/find';

class SettingsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmItem: null
    }
  }

  handleConnectClick(platform) {
    localStorage.setItem("redirectTo", this.props.currentPath);
    window.location = `/connect/${platform.id}`;
  }

  handleDisconnectClick(platform) {
    this.setState({confirmItem: platform.id});
  }

  handleBacktrack() {
    this.setState({confirmItem: null}); 
  }

  handleActualDisconnect(platform) {
    localStorage.setItem("redirectTo", this.props.currentPath);
    window.location = `/disconnect/${platform.id}`;
  }

  createConnectedItem(platform, i) {
    const { confirmItem } = this.state;
    const confirm = confirmItem === platform.id;
    return (
      <div key={i} className="drawer__item is-connected">
        <span className={`drawer__item-icon icon-${platform.id}`}></span>
        {platform.label}
        <span className={"drawer__item-meta drawer__item-meta--02" + (confirm ? "" : " is-inactive")}>
          <span className="drawer__item-info">Sure?</span>
          <span 
            onClick={this.handleActualDisconnect.bind(this, platform)} 
            className="drawer__item-action"> Yes</span>
          <span 
            onClick={this.handleBacktrack.bind(this)} 
            className="drawer__item-action drawer__item-action--plain">/ No</span>
        </span>
        <span 
          onClick={this.handleDisconnectClick.bind(this, platform)} 
          className={"drawer__item-meta drawer__item-meta--01" + (confirm ? " is-inactive" : "")}>
          <span className="drawer__item-action drawer__item-action--plain">Disconnect</span>
        </span>
      </div>
    )
  }

  createDisconnectedItem(platform, i) {
    return (
      <div key={i} className="drawer__item">
        <span className={`drawer__item-icon icon-${platform.id}`}></span>
        {platform.label}
        <span className="drawer__item-meta">
          <span
            onClick={this.handleConnectClick.bind(this, platform)} 
            className="drawer__item-action">Connect</span>
        </span>
      </div>
    )
  }


  render() {
    const { user } = this.props;
    const connectedPlatforms = platforms.filter(platform => user.platforms.indexOf(platform.id) !== -1);
    const disconnectedPlatforms = platforms.filter(platform => user.platforms.indexOf(platform.id) === -1);
    return (
      <div className="drawer__content">
        <div className="drawer__section drawer__section--full">
          <div className="drawer__section-header">
            Platforms
          </div>
          <div className="drawer__list">
            {connectedPlatforms.map(this.createConnectedItem.bind(this))}
            {disconnectedPlatforms.map(this.createDisconnectedItem.bind(this))}
          </div>
        </div>
      </div>
    )
  }
};

export default SettingsDrawer;