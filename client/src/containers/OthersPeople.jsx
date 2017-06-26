import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'app/components/others-people/Sidebar.jsx';
import BubblesCanvas from 'app/components/others-people/BubblesCanvas.js';
import Drawer from 'app/components/Drawer.jsx';
import Loader from 'app/components/common/Loader.jsx';
import PixelFilter from 'app/components/common/PixelFilter.jsx';
import Options from 'app/components/others-people/Options.jsx';
import * as actions from 'app/actions';
import _find from 'lodash/find';

import {
  withRouter,
  Route
} from 'react-router-dom';

const DRAWER_WIDTH = 350;

class Others extends Component {

  constructor(props) {
    super(props);
    this.bubblesCanvas = BubblesCanvas();
  }

  componentDidMount() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();
    const allLoaded = users && (users.length === ui.userCount);

    this.handleBubbleClick = this.handleBubbleClick.bind(this);
    this.handleTransitionStart = this.handleTransitionStart.bind(this);

    this.context.store.dispatch(actions.resetUi());
    // if user landed on profile there will be already 1-2 profiles
    !allLoaded && store.dispatch(actions.fetchAll());

    this.bubblesCanvas
      .data(allLoaded ? users : null)
      .dimensions(ui.windowDimensions)
      .canvas(this.bubbleContainer)
      .on('click', this.handleBubbleClick)
      .on('mouseenter', () => console.log('mouseenter'))
      .on('mouseleave', () => console.log('mouseleave'));
  }

  handleBubbleClick(d) {
    this.props.history.push(`/${d.id}/feed`);
  }

  handleTransitionStart() {
    this.context.store.dispatch(actions.resetUi());
  }

  componentDidUpdate() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();
    const allLoaded = users && (users.length === ui.userCount);

    this.bubblesCanvas
      .dimensions(ui.windowDimensions)
      .data(allLoaded ? users : null)
      .canvas(this.bubbleContainer)
      .margins({left: ui.drawer ? DRAWER_WIDTH : 0})
      .user(_find(users, {id: user.login}))
      .properties(ui.othersPeopleOptions)
      .update();
  }

  handleMenuClick(menuId) {
    this.context.store.dispatch(actions.toggleDrawer(menuId));
  }

  render() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();
    const allLoaded = users && (users.length === ui.userCount);

    if(!users)
      return <Loader copy="Loading Users" />

    return (
      <div>
        <Sidebar onMenuClick={this.handleMenuClick.bind(this)} drawer={ui.drawer} offset={DRAWER_WIDTH} />
        <Drawer width={DRAWER_WIDTH} isOpen={ui.drawer}>
          {(ui.drawer === 'options') && <Options />}
        </Drawer>
        {!allLoaded && <Loader copy="Loading remaining users" />}
        <canvas 
          width={ui.windowDimensions[0]} 
          height={ui.windowDimensions[1]} 
          ref={(el) => this.bubbleContainer = el} 
          className="bubbles" style={{filter: "url(#pixelate)"}}></canvas>
        <PixelFilter />
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Others);