import { dispatch as d3Dispatch } from 'd3-dispatch';
import { rebind, getDistance } from '../../utility';
import { forceSimulation as d3ForceSimulation } from 'd3-force';
import { forceManyBody as d3ForceManyBody } from 'd3-force';
import { forceCollide as d3ForceCollide } from 'd3-force';
import { forceX as d3ForceX } from 'd3-force';
import { forceY as d3ForceY } from 'd3-force';
import { randomNormal as d3RandomNormal } from 'd3-random';
import Bubble from './Bubble';
import _find from 'lodash/find';

function BubblesCanvas() {
  let canvas;
  let dispatch = d3Dispatch('click', 'mouseleave', 'mouseenter', 'transitionstart');
  let ctx;
  let size;
  let margins = {top: 0, right: 0, bobbotm: 0, left: 0};
  let subs;
  let maxRadius = 15;
  let minRadius = 2;
  let _bubblesCanvas = {};
  let bubbles;

  const collide = d3ForceCollide( function(d){return d.r + 2 }).iterations(2);
  const charge = d3ForceManyBody().strength(-0.5);
  const forceX = d3ForceX()
    .strength(.02)
    .x(d => d.targetX);
  const forceY = d3ForceY()
    .strength(.02)
    .y(d => d.targetY);
  let isUser;
  let hoveredBubble = null;
  let i = 0;

  let simulation = d3ForceSimulation(bubbles)
      .force("collide", collide)
      .velocityDecay(0.2)
      .force("charge", charge)
      .force("x", forceX)
      .force("y", forceY)
      .on("tick", render);

  const colors = ["#3A63FA", "#EC6591", "#FEC89A"];

  _bubblesCanvas.update = function() {
    if(!subs || !canvas) return;
    if(!bubbles) initializeBubbles();
    updateBubbles();
    restartSimulation();
    return _bubblesCanvas;
  }

  _bubblesCanvas.destroy = function() {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('click', handleClick);
    simulation.on("tick", null);
  }

  _bubblesCanvas.canvas = function(_canvas) {
    if(!_canvas) return _bubblesCanvas;
    canvas = _canvas;
    ctx = canvas.getContext('2d');
    return _bubblesCanvas;
  }

  // subs = [[userSubs], [commonSubs], [profileSubs]]
  _bubblesCanvas.subs = function(_) {
    if(!arguments.length) return subs;
    subs = _;
    return _bubblesCanvas;
  }

  _bubblesCanvas.isUser = function(_) {
    if(!arguments.length) return isUser;
    isUser = _;
    return _bubblesCanvas;
  }

  _bubblesCanvas.margins = function(_) {
    if(!arguments.length) return margins;
    margins = {...margins, ..._};
    return _bubblesCanvas;
  }

  _bubblesCanvas.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return _bubblesCanvas;
  }

  function initializeBubbles() {
    bubbles = [];
    let groupedBubbles = subs.map((subsGroup, subscriberIndex) => {
      const colIndex = isUser && (subscriberIndex === 1) ? 0 : subscriberIndex;
      return subsGroup.map((sub, subIndex) => {
        const pos = getPosition(subscriberIndex);
        return Bubble(ctx, {
          ...sub,
          x: pos.x + d3RandomNormal(0, 100)(),
          y: pos.y + d3RandomNormal(0, 100)(),
          fill: colors[colIndex],
          r: d3RandomNormal(7, .4)(),//sub.relevance * (maxRadius - minRadius) + minRadius,
          subscriber: subscriberIndex
        })
      })
    });

    groupedBubbles.forEach(group => bubbles = bubbles.concat(group));
    registerEvents();
    simulation.nodes(bubbles);
  }

  function registerEvents() {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
  }

  function updateBubbles() {
    bubbles.forEach((bubble) => {
      const { x: targetX, y: targetY } = getPosition(bubble.subscriber);
      bubble.update({ targetX, targetY });
    });
  }

  function render() {
    if(!canvas) return;
    ctx.clearRect(0, 0, size[0], size[1]);
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

  function getPosition(index) {
    return {
      x: (index + 1) * (size[0] - margins.left) / 4 + margins.left,
      y: size[1] / 2
    }
  }

  function handleClick(e) {
    let bubble = simulation.find(e.clientX, e.clientY, maxRadius);
    if(bubble)
      dispatch.call('click', null, bubble);
  }

  function handleMouseMove(e) {
    let bubble = simulation.find(e.clientX, e.clientY, maxRadius);
    if(!bubble && !hoveredBubble) return;
    if(hoveredBubble && !bubble)
      dispatch.call('mouseleave', null, hoveredBubble);
    else if(!hoveredBubble && bubble)
      dispatch.call('mouseenter', null, bubble);
    else if(bubble.id !== hoveredBubble.id) {
      dispatch.call('mouseleave', null, hoveredBubble);
      dispatch.call('mouseenter', null, bubble);
    }
    hoveredBubble = bubble;
  }

  return rebind(_bubblesCanvas, dispatch, 'on');
}


export default BubblesCanvas;