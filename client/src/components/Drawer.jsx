import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';

const onClick = () => {
  const currentPath = window.location.pathname;
  localStorage.setItem("redirectTo", currentPath);
  window.location = "/connect/twitter";
}

class Drawer extends Component {
  render() {
    const { isOpen, width } = this.props;
    const isOpenClass = isOpen ? "is-open" : "";
    return (
      <div style={{width}} className={`drawer ${isOpenClass}`}>
        {this.props.children}
      </div>
    )
  }
};

export default Drawer;