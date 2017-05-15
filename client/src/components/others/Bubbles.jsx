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
  let bubbleEnter, bubbleUpdate, bubble;
  let me;
  let dispatch = d3Dispatch('click');

  function _bubbles(container) {
    if(container)
      rootUpdate = d3Select(container).data([1]);

    rootEnter = rootUpdate
      .enter()
      .append('svg')
      .attr('height', 1440)
      .attr('width', 1024);

    root = rootEnter.merge(rootUpdate);

    if(!data) data = [];

    bubbleUpdate = root
      .selectAll('g.bubble')
      .data(data);

    bubbleEnter = bubbleUpdate
      .enter()
      .append('g')
      .classed('bubble', true)
      .classed('is-me', d => d.id === me)
      .classed('is-visited', d => d.visited)
      .on('click', handleClick)
      .append('circle')
      .style('stroke', "#000")
      .attr('cx', (d, i) => Math.random() * 1440)
      .attr('cy', (d, i) => Math.random() * 1024)
      .attr('r', (d, i) => Math.random() * 60 + 20);

    bubble = bubbleEnter.merge(bubbleUpdate);

    return _bubbles;
  }

  function transitionOut(clickedBubble) {
    return bubble
      .transition()
      .delay((d, i) => ((d.id === clickedBubble.id) ? 0 : Math.random() * 100 + 100) )
      .style('transform', 'scale(4)')
      .style('opacity', 0);
  }

  function handleClick(d, i) {
/*    transitionOut(d)
      .on('end', () => {
        console.log('transition ended');
        
      });*/

    dispatch.call('click', this, d, i);
  }

  _bubbles.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _bubbles;
  }

  _bubbles.me = function(_) {
    if(!arguments.length) return me;
    me = _;
    return _bubbles;
  }

  return rebind(_bubbles, dispatch, 'on');
}


export default Bubbles;