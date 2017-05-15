import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Sidebar from '../components/others/Sidebar.jsx';
import Drawer from '../components/Drawer.jsx';
import * as actions from '../actions';
import _find from 'lodash/find';
import Bubbles from '../components/others/Bubbles.jsx';

import {
  withRouter,
  Route
} from 'react-router-dom';

const bubbles = Bubbles();

const DRAWER_WIDTH = 350;

class Others extends Component {

  componentDidMount() {
    const { store } = this.context;
    const { users } = store.getState();
    const { history } = this.props;
    !users && store.dispatch(actions.fetchAll());

    bubbles
      .data(users)
      .on('click', function(d) {
        history.push('/someone/' + d.id);
      })(this.bubbleContainer);
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
    const { store } = this.context;
    const { users } = store.getState();

    bubbles.data(users)(this.bubbleContainer);
  }

  createUsersList() {
    const { store } = this.context;
    const { users, user } = store.getState();

    if(!users) return;
    return users.map((bubbleUser, i) => {
      const age = _find(bubbleUser.predictions, {trait: "age"});

      return (
        <p key={i}>
          <Link to={`/someone/${bubbleUser.id}`}>{bubbleUser.id}</Link> is probably around {age && age.value} years old
        </p>
      )
    })
  }

  handleMenuClick(menuId) {
    this.context.store.dispatch(actions.toggleDrawer(menuId));
  }

  render() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();

    return (
      <div>
        <Sidebar onMenuClick={this.handleMenuClick.bind(this)} drawer={ui.drawer} offset={DRAWER_WIDTH} />
        <Drawer width={DRAWER_WIDTH} isOpen={ui.drawer}>
        </Drawer>
        <svg width={ui.windowDimensions[0]} height={ui.windowDimensions[1]} ref={(el) => this.bubbleContainer = el}></svg>
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Others);