import React from 'react';
import { Link } from 'react-router-dom';
import _find from 'lodash/find';

const optionsConfig = {
  user: [
    {
      id: 'user_settings',
      label: 'Your Profile'
    },
    {
      id: 'predictions',
      label: 'Predictions'
    }
  ],
  profile: [
    {
      id: 'predictions',
      label: 'Predictions'
    },
    {
      id: 'info',
      label: 'Info'
    }
  ]
}

const Platforms = ({ userProfile, profile }) => {
  const isUser = userProfile.id === profile.id;
  const platforms = isUser ? userProfile.platforms : profile.platforms;
  if(!platforms) return <div/>;
  return (
    <div className="sidebar__platforms">
      <div className="sidebar__platforms-title">Connected to</div>
      {
        platforms.map(platform => {
          const userIsConnected = _find(userProfile.platforms, {id: platform.id});
          const connectedClass = userIsConnected ? 'is-connected' : '';
          return (
            <span key={platform.id} className={`sidebar__platform sidebar__platform--${connectedClass}`}>
              <span className={`sidebar__platform-icon icon-${platform.id}`}></span>
            </span>
          )
        })
      }
    </div>
  )
}

const Sidebar = ({ drawer, offset, userProfile, profile, onMenuClick }) => {
  const isUser = userProfile.id === profile.id;
  const options = isUser ? optionsConfig.user : optionsConfig.profile;
  const elStyle = {
    transform: `translateX(${drawer ? offset : 0}px)`
  }
  const titleStyle = {
    transform: `translateX(${drawer ? -offset : 0}px)`
  }

  if(!profile || !userProfile) return <div/>;

  return (
    <div style={elStyle} className="sidebar">
      <div className="sidebar__links">
        <div className="sidebar__link-group">
          <Link className="sidebar__link" to="/"><i className="icon-long-arrow-back"/> Everyone</Link>
        </div>
        <div className="sidebar__link-group">
          {options.map(option => {
            let isActive = option.id === drawer;
            let activeClass = isActive ? 'is-active' : '';
            let closeIcon = isActive ? <span className="sidebar__link-icon icon-cross"/> : undefined;
            return <div 
              key={option.id} 
              className={`sidebar__link ${activeClass}`} 
              onClick={ () => onMenuClick(option.id) }>
                {closeIcon}
                <span>{option.label}</span>
              </div>
          })}
        </div>
        <Platforms userProfile={userProfile} profile={profile}/>
      </div>
    </div>
  )
};

export default Sidebar;