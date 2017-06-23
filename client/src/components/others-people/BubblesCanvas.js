import { dispatch as d3Dispatch } from 'd3-dispatch';
import { forceCollide as d3ForceCollide } from 'd3-force';
import { rebind, getDistance } from '../../utility';
import { forceSimulation as d3ForceSimulation } from 'd3-force';
import { forceX as d3ForceX } from 'd3-force';
import { forceY as d3ForceY } from 'd3-force';
import { randomNormal as d3RandomNormal } from 'd3-random';
import { max as d3Max } from 'd3-array';

import Bubble from './Bubble';
import _find from 'lodash/find';
import predictions from 'root/constants/predictions';

// PIXELATION CODE
// http://jsfiddle.net/epistemex/u6apxgfk/

function BubblesCanvas() {
  let canvas;
  let dispatch = d3Dispatch('click', 'mouseleave', 'mouseenter', 'transitionstart');
  let ctx;
  let dimensions;
  let margins = {top: 0, right: 0, bobbotm: 0, left: 0};
  let data;
  let _bubblesCanvas = {};
  let bubbles;
  let user;
  let properties;
  let maxBubbleRadius = 50;
  const strengthGenerator = d3RandomNormal(0.1, 0.03);
  const forceX = d3ForceX().strength(strengthGenerator).x((d) => d.targetX)
  const forceY = d3ForceY().strength(strengthGenerator).y((d) => d.targetY)
  let hoveredBubble = null;

  let simulation = d3ForceSimulation()
      .force("collide", d3ForceCollide( function(d){return d.r - d.r * 0.1 }))
      .force("x", forceX)
      .force("y", forceY)
      .on("tick", render);


  _bubblesCanvas.update = function(_canvas) {
    if(!data || !canvas) return;
    if(!bubbles) initializeBubbles();
    updateBubbles();
    restartSimulation();
    return _bubblesCanvas;
  }

  _bubblesCanvas.destroy = function() {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('click', handleClick);
  }

  _bubblesCanvas.canvas = function(_canvas) {
    if(!_canvas) return _bubblesCanvas;
    canvas = _canvas;
    ctx = canvas.getContext('2d');
    return _bubblesCanvas;
  }

  _bubblesCanvas.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _bubblesCanvas;
  }

  _bubblesCanvas.margins = function(_) {
    if(!arguments.length) return margins;
    margins = {...margins, ..._};
    return _bubblesCanvas;
  }

  _bubblesCanvas.user = function(_) {
    if(!arguments.length) return user;
    user = _;
    return _bubblesCanvas;
  }

  _bubblesCanvas.dimensions = function(_) {
    if(!arguments.length) return dimensions;
    dimensions = _;
    return _bubblesCanvas;
  }

  _bubblesCanvas.properties = function(_) {
    if(!arguments.length) return properties;
    properties = _;
    return _bubblesCanvas;
  }

  function initializeBubbles() {
    const getSimilarity = calculateSimilarity(user, data, properties);

    bubbles = data.map((profile) => {
      const similarity = getSimilarity(profile);

      return Bubble(ctx, {
        id: profile.id,
        x: dimensions[0] / 2,
        y: dimensions[0] / 2,
        angle: Math.random() * Math.PI * 2,
        fill: isUser(profile) ? "#3163FF" : "rgba(0, 0, 0, .3)",
        r: Math.sqrt(similarity) * maxBubbleRadius + 2
      });
    });
    registerEvents();
    simulation.nodes(bubbles);
  }

  function registerEvents() {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
  }

  function render() {
    if(!canvas) return;
    ctx.clearRect(0, 0, dimensions[0], dimensions[1]);
    bubbles && bubbles.forEach((bubble) => bubble.render());
  }

  function restartSimulation() {
    simulation
      .alpha(1)
      .alphaTarget(0)
      .force("x", forceX)
      .force("y", forceY)
      .restart();
  }

  function updateBubbles() {
    let selectedProperties = properties.filter((property) => property.value);
    selectedProperties = selectedProperties.length ? selectedProperties : properties;
    const getSimilarity = calculateSimilarity(user, data, selectedProperties);
    const maxRadius = dimensions[1]/2;
    const centerX = (dimensions[0] - margins.left - margins.right) / 2 + margins.left;

    bubbles.forEach((bubble) => {
      const profile = _find(data, {id: bubble.id});
      const similarity = getSimilarity(profile);
      const r = maxRadius - similarity * maxRadius;
      let targetX = Math.cos(bubble.angle) * r + centerX;
      let targetY = Math.sin(bubble.angle) * r + dimensions[1] / 2;
      if(isUser(bubble)) {
        targetX = centerX;
        targetY = dimensions[1] / 2;
      }
      bubble.update({ targetX, targetY });
    });
  }

  function handleClick(e) {
    let bubble = getBubbleUnderCursor(e);
    if(bubble)
      dispatch.call('click', null, bubble);
  }

  function handleMouseMove(e) {
    let bubble = getBubbleUnderCursor(e);
    if(!bubble && !hoveredBubble) return;
    if(hoveredBubble && !bubble)
      dispatch.call('mouseleave', hoveredBubble);
    else if(!hoveredBubble && bubble)
      dispatch.call('mouseenter', bubble);
    else if(bubble.id !== hoveredBubble.id) {
      dispatch.call('mouseleave', hoveredBubble);
      dispatch.call('mouseenter', bubble);
    }
    hoveredBubble = bubble;
  }

  function getBubbleUnderCursor(e) {
    for(let i=0; i<bubbles.length; i++) {
      const bubble = bubbles[i];
      const distance = getDistance({x: bubble.x, y: bubble.y}, {x: e.clientX, y: e.clientY});
      if(distance < bubble.r) {
        return bubble;
        break;
      }
    }
  }

  function calculateSimilarity(user, users, properties) {
    // the differences between max and min of user prediction values
    // should probably also find the minimums...
    const maxDifferences = properties.map((property) => {
      return d3Max(users, (profile) => {
        const userPrediction = _find(user.predictions, {id: property.id}).value;
        const profilePrediction = _find(profile.predictions, {id: property.id}).value;
        return Math.abs(userPrediction - profilePrediction);
      });
    });

    return function(profile, overall) {
      // if overall, use all properties to calculate similarity
      // otherwise just use the selected ones
      let similarity = properties.reduce((sum, property, i) => {
        const userValue = _find(user.predictions, {id: property.id}).value;
        const profileValue = _find(profile.predictions, {id: property.id}).value;
        let difference = Math.abs(profileValue - userValue);
        return sum + difference/maxDifferences[i];
      }, 0);

      return 1 - similarity/properties.length;
    }
  }

  function isUser(profile) {
    return profile.id === user.id;
  }

  return rebind(_bubblesCanvas, dispatch, 'on');
}


export default BubblesCanvas;