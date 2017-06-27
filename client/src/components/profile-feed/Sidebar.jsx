import React from 'react';
import { Link } from 'react-router-dom';

const optionsConfig = {
  user: [
    {
      id: 'user_settings',
      label: 'Settings'
    },
    {
      id: 'predictions',
      label: 'Predictions'
    }
  ],
  profile: [
    {
      id: 'profile_sources',
      label: 'Sources'
    },
    {
      id: 'profile_comparison',
      label: 'Comparison'
    },
    {
      id: 'predictions',
      label: 'Predictions'
    }
  ]
}


const Sidebar = ({ drawer, offset, isUser, profile, onMenuClick }) => {
  const title = isUser ? <div>your<br/>internet</div> : <div>the internet of<br/>someone else</div>;
  const options = isUser ? optionsConfig.user : optionsConfig.profile;
  const elStyle = {
    transform: `translateX(${drawer ? offset : 0}px)`
  }
  const titleStyle = {
    transform: `translateX(${drawer ? -offset : 0}px)`
  }

  if(!profile) return <div/>

  return (
    <div style={elStyle} className="sidebar">
      <h1 style={titleStyle} className="sidebar__title">{title}</h1>
      <div className="sidebar__links">
        <div className="sidebar__link-group">
          <Link className="sidebar__link" to="/"><i className="icon-long-arrow-back"/> Back</Link>
        </div>
        <div className="sidebar__link-group">
          {options.map((option) => {
            let activeClass = option.id === drawer ? 'is-active' : '';
            return <div key={option.id} className={`sidebar__link ${activeClass}`} onClick={ () => onMenuClick(option.id) }>{option.label}</div>
          })}
        </div>
      </div>
    </div>
  )
};

export default Sidebar;