import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../../actions';

var options =  [
  {
    id: 'Predictions',
    label: 'predictions'
  },
  {
    id: 'info',
    label: 'Info'
  }
]

const Sidebar = ({ offset, onMenuClick, drawer }) => {
  const elStyle = {
    transform: `translateX(${drawer ? offset : 0}px)`
  }
  const titleStyle = {
    transform: `translateX(${drawer ? -offset : 0}px)`
  }

  return (
    <div style={elStyle} className="sidebar">
      <h1 style={titleStyle} className="sidebar__title">the internet of<br/>other people</h1>

      <div className="sidebar__links">
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
      </div>
    </div>
  )
};

export default Sidebar;