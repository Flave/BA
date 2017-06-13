import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Sidebar from 'app/components/others-people/Sidebar.jsx';
import Drawer from 'app/components/Drawer.jsx';

import {
  withRouter,
  Route
} from 'react-router-dom';

const DRAWER_WIDTH = 350;

class Others extends Component {


  render() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();

    return (
      <div>
        {/*<Sidebar onMenuClick={this.handleMenuClick.bind(this)} drawer={ui.drawer} offset={DRAWER_WIDTH} />*/}
        <Drawer width={DRAWER_WIDTH} isOpen={ui.drawer}>Others Content Drawer</Drawer>
        This is the content of other people
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Others);