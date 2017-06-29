import React, { Component } from 'react';

import {
  withRouter
} from 'react-router-dom';


class Info extends Component {
  render() {
    return (
      <div className="drawer__content">
        <div className="drawer__section">
          <p>Good Job! You discovered content of <b>13 sources</b> you wouldn't have discovered on your internet...</p>
        </div>
      </div>
    )
  }
};

export default withRouter(Info);