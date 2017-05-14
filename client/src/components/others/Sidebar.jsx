import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../../actions';

const Sidebar = ({ offset, onMenuClick, drawer }) => {
  const style = {
    transform: `translateX(${drawer ? offset : 0}px)`
  }
  return (
    <div className="sidebar">
      <span className="sidebar__title">the internet of<br/>other people</span>

      <div style={style} className="sidebar__links">
        <div className="sidebar__link-group">
          <div className="sidebar__link" onClick={onMenuClick.bind(null, 'options')}>Options</div>
          <div className="sidebar__link" onClick={onMenuClick.bind(null, 'info')}>Info</div>
        </div>
      </div>
    </div>
  )
};

export default Sidebar;