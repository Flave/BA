import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'app/components/others-people/Sidebar.jsx';
import Bubbles from 'app/components/others-people/Bubbles.jsx';
import BubblesCanvas from 'app/components/others-people/BubblesCanvas.js';
import OthersNav from 'app/components/others/OthersNav.jsx';
import Drawer from 'app/components/Drawer.jsx';
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

    this.handleBubbleClick = this.handleBubbleClick.bind(this);
    this.handleTransitionStart = this.handleTransitionStart.bind(this);

    this.context.store.dispatch(actions.resetUi());
    !users && store.dispatch(actions.fetchAll());

    this.bubblesCanvas
      .data(users)
      .dimensions(ui.windowDimensions)
      .initialize(this.bubbleContainer)
      .on('click', this.handleBubbleClick)
      .on('mouseenter', () => console.log('mouseenter'))
      .on('mouseleave', () => console.log('mouseleave'));
  }

  handleBubbleClick(d) {
    this.props.history.push('/someone/' + d.id);
  }

  handleTransitionStart() {
    this.context.store.dispatch(actions.resetUi());
  }

  componentDidUpdate() {
    const { store } = this.context;
    const { users, user, ui } = store.getState();

    this.bubblesCanvas
      .dimensions(ui.windowDimensions)
      .data(users)
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

    return (
      <div>
        <Sidebar onMenuClick={this.handleMenuClick.bind(this)} drawer={ui.drawer} offset={DRAWER_WIDTH} />
        <Drawer width={DRAWER_WIDTH} isOpen={ui.drawer}>
          {(ui.drawer === 'options') && <Options />}
        </Drawer>
        <OthersNav />
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