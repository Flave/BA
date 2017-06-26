import React, { Component } from 'react';
import { dispatch as d3Dispatch } from 'd3-dispatch';
import { rebind, getDistance } from '../../utility';
import { forceSimulation as d3ForceSimulation } from 'd3-force';
import { forceManyBody as d3ForceManyBody } from 'd3-force';
import { forceCollide as d3ForceCollide } from 'd3-force';
import { forceX as d3ForceX } from 'd3-force';
import { forceY as d3ForceY } from 'd3-force';
import { randomNormal as d3RandomNormal } from 'd3-random';
import { max as d3Max } from 'd3-array';
import Bubble from './Bubble';
import _find from 'lodash/find';



function BubblesCanvas() {
  let canvas;
  let dispatch = d3Dispatch('click', 'mouseleave', 'mouseenter', 'transitionstart');
  let ctx;
  let dimensions;
  let margins = {top: 0, right: 0, bobbotm: 0, left: 0};
  let subs;
  let _bubblesCanvas = {};
  let bubbles;
  let counts;

  const collide = d3ForceCollide( function(d){return d.r + 2 }).iterations(2);
  const charge = d3ForceManyBody().strength(-0.5);
  const forceX = d3ForceX()
    .strength(.018)
    .x(d => d.targetX);
  const forceY = d3ForceY()
    .strength(.018)
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

  const colors = ["rgba(80, 140, 230, .5)", "red", "rgba(180, 140, 100, .5)"];

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
  }

  _bubblesCanvas.canvas = function(_canvas) {
    if(!_canvas) return _bubblesCanvas;
    canvas = _canvas;
    ctx = canvas.getContext('2d');
    return _bubblesCanvas;
  }

  _bubblesCanvas.subs = function(_) {
    if(!arguments.length) return subs;
    subs = _;
    return _bubblesCanvas;
  }

  _bubblesCanvas.counts = function(_) {
    if(!arguments.length) return counts;
    counts = _;
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

  _bubblesCanvas.dimensions = function(_) {
    if(!arguments.length) return dimensions;
    dimensions = _;
    return _bubblesCanvas;
  }

  function initializeBubbles() {
    bubbles = subs.map((sub) => {
      const { x, y } = getPosition(sub);
      return Bubble(ctx, {
        id: sub.id,
        subscriber: sub.subscriber,
        x: dimensions[0]/2 + d3RandomNormal(0, 200)(),
        y: dimensions[1]/2 + d3RandomNormal(0, 200)(),
        fill: colors[sub.subscriber],
        r: d3RandomNormal(6, .3)()
      });
    });

    registerEvents();
    simulation.nodes(bubbles);
  }

  function registerEvents() {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
  }

  function updateBubbles() {
    bubbles.forEach((bubble) => {
      const { x: targetX, y: targetY } = getPosition(bubble);
      bubble.update({ targetX, targetY });
    });
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

  function getPosition(sub) {
/*    let xOrigin = (sub.subscriber + 1) * dimensions[0] / 4;
    let xOffset = d3RandomNormal(0, 100)();*/
    return {
      x: (sub.subscriber + 1) * dimensions[0] / 4,
      y: dimensions[1] / 2
    }
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

  return rebind(_bubblesCanvas, dispatch, 'on');
}


class SourcesBubbles extends Component {

  componentDidMount() {
    this.bubbles = BubblesCanvas();
    this.updateVis();
  }

  componentDidUpdate() {
    this.updateVis();
  }

  updateVis() {
    let { subs, isUser, counts, dimensions } = this.props;
    this.bubbles
      .subs(subs)
      .counts(counts)
      .isUser(isUser)
      .canvas(this.canvas)
      .dimensions(dimensions)
      .update();
  }

  render() {
    let { dimensions } = this.props;

    return (
      <div>
        <canvas 
          width={dimensions[0]} 
          height={dimensions[1]}
          ref={canvas => this.canvas = canvas}></canvas>
      </div>
    )
  }
};


export default SourcesBubbles;