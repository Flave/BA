import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from '../components/Login.jsx';
import { fetchLogin } from '../api';
import { receiveLogin } from '../actions';


class Intro extends Component {
  render() {
    return (
      <div className="intro">
        <Login />
      </div>
    )
  }
}

export default Intro;