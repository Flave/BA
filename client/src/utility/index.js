import { max as d3Max } from 'd3-array';
import _find from 'lodash/find';
import { ui } from 'root/constants';

// Copies a variable number of methods from source to target.
export const rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = _rebind(target, source, source[method]);
  return target;
};

function _rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

/*export const getTranslation = function getTranslation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function 
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);
  
  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix. 
  var matrix = g.transform.baseVal.consolidate().matrix;
  
  // As per definition values e and f are the ones for the translation.
  return [matrix.e, matrix.f];
}*/

export const getDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt( dx*dx + dy*dy );
}

const baseURLs = {
  facebook: "https://www.facebook.com/",
  twitter: "https://twitter.com/",
  youtube: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/"
}

export const getSubURL = sub => {
  return `${baseURLs[sub.platform]}${sub.username}`
}

// Returns
export const getSelectedPredictions = predictions => {
  let selectedPredictions = predictions.filter(prediction => prediction.value)
  return selectedPredictions.length ? selectedPredictions : predictions;
}


export const calculateSimilarity = (user, users, properties) => {
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


const getFreeSpotsGenerator = () => {
  const initialWidth = window.innerWidth;
  const initialHeight = window.innerHeight;
  const initialCenterX = initialWidth / 2;
  const xOffset = (initialCenterX % ui.FEED_COL_WIDTH) / 2;

  return (transform, profile) => {
      const feed = profile.feed.filter(item => item.initialized);
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2 - transform.x;
      const centerY = windowHeight / 2 - transform.y;
      const bottom = windowHeight - transform.y;
      const centerIndex = Math.floor(centerX / ui.FEED_COL_WIDTH);
      const colsInView = [centerIndex - 1, centerIndex, centerIndex + 1];
      const freeSpots = [];
      const availableItems = profile.feed.length - feed.length;

      colsInView.forEach(colIndex => {
        const itemsInCol = feed.filter(item => item.colIndex === colIndex);
        if(!itemsInCol.length) {
          freeSpots.push(createNewSpot(colIndex, {y: centerY, height: 0}, 'bottom', xOffset));
          freeSpots.push(createNewSpot(colIndex, {y: centerY}, 'top', xOffset));
          return;
        }
        
        itemsInCol.sort((itemA, itemB) => itemA.y - itemB.y);
        let topItem = itemsInCol[0];
        let bottomItem = itemsInCol[itemsInCol.length - 1];
        if(!topItem.loading && topItem.y < transform.y) {
          freeSpots.push(createNewSpot(colIndex, topItem, 'top', xOffset));
        }
        if(!bottomItem.loading && (bottomItem.y + bottomItem.height) < bottom) {
          freeSpots.push(createNewSpot(colIndex, bottomItem, 'bottom', xOffset));
        }

      });

      return freeSpots.slice(0, availableItems);
  }  
}

export const getFreeSpots = getFreeSpotsGenerator();


function createNewSpot(colIndex, sibling, direction, offset) {
  return {
    x: colIndex * ui.FEED_COL_WIDTH + offset + (Math.random() * 180 - 90),
    // if item should be placed at top, y is set when item is loaded
    siblingTop: sibling.y,
    y: (direction === 'top') ? null : sibling.y + sibling.height + Math.random() * 50 + 20,
    colIndex,      
  }
}