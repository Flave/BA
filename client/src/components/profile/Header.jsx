import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../../actions';

const Header = ({ isMe, profile }) => {
  const title = isMe ? "Your internet" : "Someone else's internet";
  const sourcesLabel = isMe ? "Connected Platforms" : "Sources";

  return (
    <div className="header">
      <div className="header__left">
        <span className="header__avatar"></span>
        <span className="header__title">{`< ${title} />`}</span>
      </div>
      <div className="header__right">
        {/*<Link className="btn btn--raised" to="/">Other People</Link>*/}
        <div className="header__options">
          <span className="btn btn--raised">Accounts</span>
          <span className="btn btn--raised">Content</span>
        </div>
        <span className="header__accounts-ui">
          <span className="header__accounts-label">{sourcesLabel}:</span>
          <span className="header__accounts">
            {profile.accounts.map((platform, i) => {
              if(!platform.isConnected) return;
              return (
                <span key={i} className={`header__account`}>
                  <span className={`icon-${platform.name}`}></span>
                </span>
              )
            })}
          </span>
          <span className="btn btn--raised">Edit</span>
        </span>
        {/*<a className="btn" href="/connect/twitter">Connect to Twitter</a>*/}        
      </div>

    </div>
  )
};

export default Header;