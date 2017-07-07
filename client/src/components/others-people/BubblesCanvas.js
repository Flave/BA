import { dispatch as d3Dispatch } from 'd3-dispatch';
import { rebind, getDistance, getSelectedPredictions, calculateSimilarity } from 'app/utility';
import { forceSimulation as d3ForceSimulation } from 'd3-force';
import { forceCollide as d3ForceCollide } from 'd3-force';
import { forceManyBody as d3ForceManyBody } from 'd3-force';
import { forceX as d3ForceX } from 'd3-force';
import { forceY as d3ForceY } from 'd3-force';
import { max as d3Max } from 'd3-array';
import { mean as d3Mean } from 'd3-array';
import { extent as d3Extent } from 'd3-array';
import { randomNormal as d3RandomNormal } from 'd3-random';

import Bubble from './Bubble';
import _find from 'lodash/find';
import predictions from 'root/constants/predictions';
import predictionOptions from 'root/constants/predictionOptions';

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
  let showUser;
  let properties;
  let maxBubbleRadius = 35;
  let minBubbleRadius = 20;
  let minDist = 80;
  let pixRatio = .15;
  let invertPixRatio = 1 / pixRatio;
  let pixDimensions;
  // to have a natural movement...
  const strengthGenerator = d3RandomNormal(0.02, 0.007);
  const collide = d3ForceCollide( function(d){return d.r + d.r * 0.1 });
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

  _bubblesCanvas.showUser = function(_) {
    if(!arguments.length) return showUser;
    showUser = _;
    return _bubblesCanvas;
  }


  function getPredictionExtents() {
    return predictions.map(({ id }) =>
      d3Extent(data, ({ predictions }) => _find(predictions, {id}).value)
    )
  }

  // converts all the predictions of the users to values that are relative 
  // to the values (extents) that are actually occurring in the data
  function convertToRelativeValues(extents) {
    return data.map(profile => {
      const relativePredictions = predictions.map(({id}, i) => {
        const extent = extents[i];
        const profileValue = _find(profile.predictions, {id}).value;
        const delta = extent[1] - extent[0];
        return (profileValue - extent[0]) / delta;
      });
      return {id: profile.id, predictions: relativePredictions}
    })
  }

  // Returns a nested array of profiles and differences for each prediction.
  function getPredictionDifferences(relativeData) {
    const userPredictions = _find(relativeData, {id: user.id}).predictions;
    return relativeData.map(profile => 
      predictions.map(({ id }, i) => {
        const userValue = userPredictions[i];
        const profileValue = profile.predictions[i];
        return {id, value: Math.abs(userValue - profileValue)};
      })
    )
  }

  // Returns a nested array of profiles and differences for each option group
  function getGroupDifferences(predictionDifferences) {
    return predictionDifferences.map(differences =>
      predictionOptions.map(group => (
        {
          id: group.id,
          value: d3Mean(group.properties, id =>
            _find(differences, {id}).value
          )
        }
      ))
    )
  }

  // Returns array of profiles containing the average difference for the selected options
  function getOverallDifferences(groupDifferences) {
    return groupDifferences.map(profileGroupDifferences => 
      d3Mean(profileGroupDifferences, group => group.value)
    )
  }

  // Returns array of profiles containing the average difference for the selected options
  function getSelectionDifferences(groupDifferences, selection) {
    return groupDifferences.map(profileGroupDifferences => 
      d3Mean(selection, ({ id }) => 
        _find(profileGroupDifferences, { id }).value
      )
    )
  }

  // returns the maximum difference for each group
  function getMaxGroupDifferences(groupDifferences) {
    return predictionOptions.map(group => 
      d3Max(groupDifferences, profileGroupDifferences => 
        _find(profileGroupDifferences, {id: group.id}).value
      )
    )
  }

  // returns the maximum difference for each group
  function getGroupDifferencesExtent(groupDifferences) {
    return predictionOptions.map(group => 
      d3Extent(groupDifferences, profileGroupDifferences => 
        _find(profileGroupDifferences, {id: group.id}).value
      )
    )
  }

  // returns the RELATIVE difference of one profile for each group
  function getProfileGroupDifferences(groupDifferences, groupDifferencesExtent) {
    return groupDifferences.map((groupDifference, i) => (
      {
        id: groupDifference.id,
        difference: groupDifference.value,
        relativeDifference: (groupDifference.value - groupDifferencesExtent[i][0]) / (groupDifferencesExtent[i][1] - groupDifferencesExtent[i][0])
      }
    ))
  }

  function getDifferencesExtent(differences) {
    return d3Extent(differences, difference => 
      difference === 0 ? undefined : difference
    )
  }

  function getDifferenceValues() {
    const extents = getPredictionExtents();
    const relativeData = convertToRelativeValues(extents);
    const predictionDifferences = getPredictionDifferences(relativeData);
    const groupDifferences = getGroupDifferences(predictionDifferences);
    const overallDifferences = getOverallDifferences(groupDifferences);
    const selectionDifferences = getSelectionDifferences(groupDifferences, getSelectedGroups());
    const maxGroupDifferences = getMaxGroupDifferences(groupDifferences);
    const groupDifferencesExtent = getGroupDifferencesExtent(groupDifferences);
    const overallDifferenceExtent = getDifferencesExtent(overallDifferences);
    const selectionDifferenceExtent = getDifferencesExtent(selectionDifferences);
    const overallDifferenceDelta = overallDifferenceExtent[1] - overallDifferenceExtent[0];
    const selectionDifferenceDelta = selectionDifferenceExtent[1] - selectionDifferenceExtent[0];

    return {
      groupDifferences,
      overallDifferences,
      selectionDifferences,
      maxGroupDifferences,
      groupDifferencesExtent,
      overallDifferenceExtent,
      selectionDifferenceExtent,
      overallDifferenceDelta,
      selectionDifferenceDelta
    }
  }

  function initializeBubbles() {
    const {
      groupDifferences, 
      overallDifferences, 
      groupDifferencesExtent,
      overallDifferenceDelta,
      overallDifferenceExtent
    } = getDifferenceValues();

    bubbles = data.map((profile, i) => {
      const thisIsUser = isUser(profile);
      const overallDifference = thisIsUser ? 0 : (overallDifferences[i] - overallDifferenceExtent[0]) / overallDifferenceDelta;
      const profileGroupDifferences = getProfileGroupDifferences(groupDifferences[i], groupDifferencesExtent);

      const angle = (Math.PI * 2) / data.length * i + d3RandomNormal(0, 0.1)();
      const dist = Math.random() * 20 + 50;
      const x = Math.cos(angle) * dist + pixDimensions[0]/2;
      const y = Math.sin(angle) * dist + pixDimensions[1]/2;
      const r = (Math.sqrt(overallDifference) * (maxBubbleRadius - minBubbleRadius) + minBubbleRadius) * pixRatio;

      return Bubble(ctx, {
        predictions: profile.predictions,
        id: profile.id,
        x: thisIsUser ? pixDimensions[0] / 2 : x,
        y: thisIsUser ? pixDimensions[1] / 2 : y,
        fill: thisIsUser ? "#3163FF" : "rgba(0, 0, 0, .3)",
        r: thisIsUser ? (minBubbleRadius * 1.5 * pixRatio) : r,
        angle,
        isUser: thisIsUser,
        differences: profileGroupDifferences
      }, user);
    });
    registerEvents();
    simulation.nodes(bubbles);
  }

  function getSelectedGroups() {
    return predictionOptions.filter(group =>
      properties.filter(prediction => 
        group.properties.indexOf(prediction.id) !== -1 && prediction.value
      ).length
    );
  }

  function updateBubbles() {
    const {
      selectionDifferences,
      selectionDifferenceExtent,
      selectionDifferenceDelta
    } = getDifferenceValues();


    let selectedGroups = getSelectedGroups();
    const shorterSide = Math.min(...dimensions);
    // TODO: margins need to be incoorporated correctly to account for height > width
    const maxDist = shorterSide/2 - margins.top - margins.bottom;
    const distScope = showUser ? (maxDist - minDist) : maxDist;
    const centerX = (dimensions[0] - margins.left - margins.right) / 2 + margins.left;

    bubbles.forEach((bubble, i) => {
      const thisIsUser = isUser(bubble);
      const selectionDifference = thisIsUser ? 0 : (selectionDifferences[i] - selectionDifferenceExtent[0]) / selectionDifferenceDelta;

      const dist = maxDist - (1 - selectionDifference) * distScope;
      let targetX = Math.cos(bubble.angle) * dist + centerX;
      let targetY = Math.sin(bubble.angle) * dist + dimensions[1] / 2;

      if(isUser(bubble)) {
        targetX = centerX;
        targetY = dimensions[1] / 2;
      }

      targetX *= pixRatio;
      targetY *= pixRatio;
      bubble.update({ targetX, targetY }, selectedGroups);
    });
  }

  function render() {
    if(!canvas) return;

    ctx.fillStyle = "#fff";
    ctx.rect(0, 0, pixDimensions[0], pixDimensions[1]);
    ctx.fill();

    bubbles && bubbles.forEach((bubble) => {
      if(isUser(bubble) && !showUser) return;
      bubble.render();
    });
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

  function isUser(profile) {
    return profile.id === user.id;
  }

  return rebind(_bubblesCanvas, dispatch, 'on');
}


export default BubblesCanvas;