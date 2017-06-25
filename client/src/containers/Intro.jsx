import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginSlide from '../components/LoginSlide.jsx';
import Loader from 'app/components/common/Loader.jsx';
import { fetchLogin } from '../api';
import { receiveLogin } from '../actions';


class Intro extends Component {
  render() {
    const { user } = this.props;
    if(!user)
      return <Loader copy="Loading App" />

    return (
      <div className="intro">
        <LoginSlide />
      </div>
    )
  }
}

export default Intro;