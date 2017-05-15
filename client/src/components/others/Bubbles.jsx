import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import { select as d3Select } from 'd3-selection';
import { dispatch as d3Dispatch } from 'd3-dispatch';
import { rebind } from '../../utility';

import {
  withRouter,
  browserHistory
} from 'react-router-dom';


function Bubbles() {
  let rootEnter, rootUpdate, root;
  let data;
  let bubble;
  let dispatch = d3Dispatch('click');

  function _bubbles(container) {
    rootUpdate = d3Select(container)
      .data([1]);

    rootEnter = rootUpdate
      .enter()
      .append('svg')
      .attr('height', 1440)
      .attr('width', 1024);

    root = rootEnter.merge(rootUpdate);

    if(!data) data = [];

    bubble = root
      .selectAll('g.bubble')
      .data(data);

    bubble
      .enter()
      .append('g')
      .classed('bubble', true)
      .on('click', handleClick)
      .append('circle')
      .attr('cx', (d, i) => Math.random() * 1440)
      .attr('cy', (d, i) => Math.random() * 1024)
      .attr('r', (d, i) => Math.random() * 60 + 20);

    return _bubbles;
  }

  function handleClick(d, i) {
    dispatch.call('click', this, d, i);
  }

  _bubbles.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _bubbles;
  }

  return rebind(_bubbles, dispatch, 'on');
}
/*
class Bubbles extends Component {
  constructor(props) {
    super(props);

    this.circles = [];
  }

  componentDidMount() {
    this.handleClick = this.handleClick.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object
  }

  handleClick(user) {
    this.context.router.history.push('/someone/' + user.id)
  }

  createUsersList() {
    const { users, user } = this.props;

    return users.map((bubbleUser, i) => {
      const circle = {
        x: Math.random() * 1440,
        y: Math.random() * 1024,
        r: Math.random() * 60 + 20
      }
      this.circles.push(circle);
      return (
        <circle 
          cx={circle.x}
          cy={circle.y}
          r={circle.r}
          key={i} 
          onClick={this.handleClick.bind(this, bubbleUser)}></circle>
      )
    })
  }

  render() {
    return (
      <svg width="1440" height="1024" className="bubbles">
        { this.createUsersList() }
      </svg>
    )
  }
}*/

export default Bubbles;