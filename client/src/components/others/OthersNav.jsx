import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

const Login = ({ user }) => {
  return  (
    <div className="others-nav">
      <NavLink activeClassName="is-active" to="/">
        <span className="others-nav__link">People</span>
      </NavLink>
      <NavLink activeClassName="is-active" to="/content">
        <span className="others-nav__link">Content</span>
      </NavLink>
    </div>
  )
}

export default Login;