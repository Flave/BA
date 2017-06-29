import { dispatch as d3Dispatch } from 'd3-dispatch';
import { rebind, getDistance, getSelectedPredictions } from '../../utility';
import { forceSimulation as d3ForceSimulation } from 'd3-force';
import { forceCollide as d3ForceCollide } from 'd3-force';
import { forceManyBody as d3ForceManyBody } from 'd3-force';
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
  let margins = {top: 20, right: 0, bottom: 20, left: 0};
  let data;
  let _bubblesCanvas = {};
  let bubbles;
  let user;
  let properties;
  let maxBubbleRadius = 50;
  let minDist = 100;
  let pixRatio = .1;
  let invertPixRatio = 1 / pixRatio;
  let pixDimensions;
  // to have a natural movement...
  const strengthGenerator = d3RandomNormal(0.02, 0.007);
  const collide = d3ForceCollide( function(d){return d.r + d.r * 0.05 });
  const forceX = d3ForceX().strength(strengthGenerator).x((d) => d.targetX);
  const forceY = d3ForceY().strength(strengthGenerator).y((d) => d.targetY);
  let hoveredBubble = null;

  let simulation = d3ForceSimulation()
      .force("collide", collide)
      .force("x", forceX)
      .force("y", forceY)
      .velocityDecay(0.2)
      .on("tick", render);


  _bubblesCanvas.update = function() {
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
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
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
    pixDimensions = [dimensions[0] * pixRatio, dimensions[1] * pixRatio];
    return _bubblesCanvas;
  }

  _bubblesCanvas.properties = function(_) {
    if(!arguments.length) return properties;
    properties = _;
    return _bubblesCanvas;
  }


  function initializeBubbles() {
    const getSimilarity = calculateSimilarity(user, data, properties);

    bubbles = data.map((profile, i) => {
      const similarity = getSimilarity(profile);
      let angle = (Math.PI * 2) / data.length * i + d3RandomNormal(0, 0.1)();
      let dist = Math.random() * 10 + 10;
      let x = Math.cos(angle) * dist + pixDimensions[0]/2;
      let y = Math.sin(angle) * dist + pixDimensions[1]/2;

      return Bubble(ctx, {
        id: profile.id,
        x: isUser(profile) ? pixDimensions[0] / 2 : x,
        y: isUser(profile) ? pixDimensions[1] / 2 : y,
        angle,
        fill: isUser(profile) ? "#3163FF" : "rgba(0, 0, 0, .3)",
        r: (Math.sqrt(similarity) * maxBubbleRadius + 2) * pixRatio
      });
    });
    registerEvents();
    simulation.nodes(bubbles);
  }

  function updateBubbles() {
    let selectedProperties = getSelectedPredictions(properties);
    const getSimilarity = calculateSimilarity(user, data, selectedProperties);
    const shorterSide = Math.min(...dimensions);
    // TODO: margins need to be incoorporated correctly to account for height > width
    const maxDist = shorterSide/2 - margins.top - margins.bottom;
    const distScope = maxDist - minDist;
    const centerX = (dimensions[0] - margins.left - margins.right) / 2 + margins.left;

    bubbles.forEach((bubble) => {
      const profile = _find(data, {id: bubble.id});
      const similarity = getSimilarity(profile);
      const dist = maxDist - similarity * distScope;
      let targetX = Math.cos(bubble.angle) * dist + centerX;
      let targetY = Math.sin(bubble.angle) * dist + dimensions[1] / 2;

      if(isUser(bubble)) {
        targetX = centerX;
        targetY = dimensions[1] / 2;
      }

      targetX *= pixRatio;
      targetY *= pixRatio;
      bubble.update({ targetX, targetY });
    });
  }

  function render() {
    if(!canvas) return;

    ctx.fillStyle = "#fff";
    ctx.rect(0, 0, pixDimensions[0], pixDimensions[1]);
    ctx.fill();

    bubbles && bubbles.forEach((bubble) => bubble.render());
    ctx.drawImage(canvas, 0, 0, pixDimensions[0], pixDimensions[1], 0, 0, dimensions[0], dimensions[1]);
  }

  function restartSimulation() {
    simulation
      .alpha(1)
      .alphaTarget(0)
      .force("x", forceX)
      .force("y", forceY)
      .restart();
  }

  function registerEvents() {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
  }

  function handleClick(e) {
    let bubble = getBubbleUnderCursor({x: e.clientX, y: e.clientY});
    if(bubble)
      dispatch.call('click', null, bubble);
  }

  function handleMouseMove(e) {
    let bubble = getBubbleUnderCursor({x: e.clientX, y: e.clientY});
    if(!bubble && !hoveredBubble) return;
    if(hoveredBubble && !bubble)
      dispatch.call('mouseleave', null, unprojectBubble(hoveredBubble));
    else if(!hoveredBubble && bubble)
      dispatch.call('mouseenter', null, unprojectBubble(bubble));
    else if(bubble.id !== hoveredBubble.id) {
      dispatch.call('mouseleave', null, unprojectBubble(hoveredBubble));
      dispatch.call('mouseenter', null, unprojectBubble(bubble));
    }
    hoveredBubble = bubble;
  }


  // Returns a bubble with "real world canvas" properties
  function unprojectBubble(bubble) {
    return {
      ...bubble,
      x: bubble.x * invertPixRatio,
      y: bubble.y * invertPixRatio,
      r: bubble.r * invertPixRatio
    }
  }

  function getBubbleUnderCursor(cursorPosition) {
    for(let i=0; i<bubbles.length; i++) {
      const bubble = bubbles[i];
      const distance = getDistance({x: invertPixRatio * bubble.x, y: invertPixRatio * bubble.y}, cursorPosition);
      if(distance < bubble.r * invertPixRatio) {
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