import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginSlide from '../components/LoginSlide.jsx';
import { fetchLogin } from '../api';
import { receiveLogin } from '../actions';


class Intro extends Component {
  render() {
    return (
      <div className="intro">
        <LoginSlide />
      </div>
    )
  }
}

export default Intro;