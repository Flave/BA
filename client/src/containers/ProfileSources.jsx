import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Profile extends Component {
  render() {

    return (
      <div>
        Sources
      </div>
    )
  }
};

Profile.contextTypes = {
  store: PropTypes.object
}

export default Profile;