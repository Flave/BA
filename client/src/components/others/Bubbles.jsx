import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import { select as d3Select } from 'd3-selection';
import { dispatch as d3Dispatch } from 'd3-dispatch';
import { rebind, getTranslation } from '../../utility';
import { easeExp as d3EaseExp } from 'd3-ease';

import {
  withRouter,
  browserHistory
} from 'react-router-dom';


function Bubbles() {
  let container;
  let rootEnter, rootUpdate, root;
  let data;
  let bubbleEnter, bubbleUpdate, bubble;
  let me;
  let dimensions;
  let dispatch = d3Dispatch('click', 'transitionstart');

  function _bubbles(_container) {
    // if component is being rendered for the first time do transition
    if(!container) {
      const transitionOptions = {startOpacity: 0, endOpacity: 1, startScale: 4, endScale: 1};
      transitionCanvas(d3Select(_container), transitionOptions);
    }

    container = d3Select(_container);

    rootUpdate = container.data([1]);

    rootEnter = rootUpdate
      .enter()
      .append('svg')
      .attr('height', dimensions[0])
      .attr('width', dimensions[1]);

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
      .attr('transform', () => {
        return `translate(${Math.random() * dimensions[0]}, ${Math.random() * dimensions[1]})`
      })
      .on('click', handleClick)
      .append('circle')
      .style('stroke', "#000")
      .attr('r', (d, i) => Math.random() * 60 + 20);

    bubble = bubbleEnter.merge(bubbleUpdate);

    return _bubbles;
  }

  function transitionCanvas(container, {startScale, endScale, startOpacity, endOpacity}, clickedBubble) {
    let translation;
    let centerX = 50;
    let centerY = 50;

    if(clickedBubble) {
      translation = getTranslation(d3Select(clickedBubble).attr('transform'));
      centerX = (translation[0] / dimensions[0]) * 100;
      centerY = (translation[1] / dimensions[1]) * 100;
    }

    return container
      .attr('transform', `scale(${startScale})`)
      .style('opacity', startOpacity)
      .attr('transform-origin', `${centerX}% ${centerY}%`)
      .transition()
      .duration(2500)
      .ease(d3EaseExp)
      .attr('transform', `scale(${endScale})`)
      .style('opacity', endOpacity);
  }

  function handleClick(d, i) {
    dispatch.call('transitionstart', this);
    const transitionOptions = {startOpacity: 1, endOpacity: 0, startScale: 1, endScale: 34};
    transitionCanvas(container, transitionOptions, this)
      .on('end', () => {
        dispatch.call('click', this, d, i);
      });
  }

  _bubbles.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _bubbles;
  }

  _bubbles.dimensions = function(_) {
    if(!arguments.length) return dimensions;
    dimensions = _;
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