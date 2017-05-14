import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../../actions';

const Sidebar = ({ isMe, profile }) => {
  const title = isMe ? <div>your<br/>internet</div> : <div>the internet of<br/>someone else</div>;

  return (
    <div className="sidebar">
      <span className="sidebar__title">{title}</span>

      <div className="sidebar__links">
        <div className="sidebar__link-group">
          <Link className="sidebar__link" to="/">Back</Link>
        </div>
        <div className="sidebar__link-group">
          <div className="sidebar__link">Options</div>
          <div className="sidebar__link">Predictions</div>
        </div>
      </div>
    </div>
  )
};

export default Sidebar;