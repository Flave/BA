import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'app/components/others-people/Sidebar.jsx';
import BubblesCanvas from 'app/components/others-people/BubblesCanvas.js';
import Drawer from 'app/components/Drawer.jsx';
import Loader from 'app/components/common/Loader.jsx';
import Tooltip from 'app/components/common/Tooltip.jsx';
import Predictions from 'app/components/common/Predictions.jsx';
import Options from 'app/components/others-people/Options.jsx';
import Info from 'app/components/others-people/Info.jsx';
import { getSelectedPredictions } from 'app/utility';
import * as actions from 'app/actions';
import _find from 'lodash/find';
import { ui } from 'root/constants';

import {
  withRouter,
  Route
} from 'react-router-dom';

const { DRAWER_WIDTH } = ui;

class Others extends Component {

  constructor(props) {
    super(props);
    this.bubblesCanvas = BubblesCanvas();
    this.state = {
      hoveredBubble: null
    }
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
      .on('mouseenter', hoveredBubble => this.setState({hoveredBubble}))
      .on('mouseleave', () => this.setState({hoveredBubble: null}));
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

  createTooltip() {
    const { store } = this.context;
    const { users, ui } = store.getState();
    const { hoveredBubble } = this.state;
    const profile = _find(users, {id: hoveredBubble.id});

    return (
      <Tooltip
        modifiers={["dark", "predictions"]}
        position={{x: hoveredBubble.x, y: hoveredBubble.y}}
        offset={{x: 0, y: -hoveredBubble.r - 11}}>
        <Predictions 
          modifiers={["tooltip"]}
          predictionsSelection={ui.othersPeopleOptions}
          profile={profile}/>
      </Tooltip>
    )
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
          {(ui.drawer === 'info') && <Info />}
        </Drawer>
        {!allLoaded && <Loader copy="Loading remaining users" />}
        <canvas 
          width={ui.windowDimensions[0]} 
          height={ui.windowDimensions[1]} 
          ref={(el) => this.bubbleContainer = el} 
          className="bubbles"></canvas>
        { this.state.hoveredBubble && this.createTooltip()}
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Others);