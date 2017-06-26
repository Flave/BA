import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

const Nav = ({ baseUrl, segments }) => {
  return  (
    <div className="nav">
      {segments.map((segment, i) => {
        return (
          <NavLink key={i} activeClassName="is-active" to={`${baseUrl}/${segment.key}`}>
            <span className="nav__segment">{segment.label}</span>
          </NavLink>
        )
      })}
    </div>
  )
}

export default Nav;