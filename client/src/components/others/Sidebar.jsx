import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../../actions';

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
          <div className="sidebar__link" onClick={ () => onMenuClick('options') }>Options</div>
          <div className="sidebar__link" onClick={ () => onMenuClick('info') }>Info</div>
        </div>
      </div>
    </div>
  )
};

export default Sidebar;