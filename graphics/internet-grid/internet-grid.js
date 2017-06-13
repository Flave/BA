var svg = d3.select("#canvas"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    tileSize = 25,
    numRows = Math.ceil(height/tileSize),
    numCols = Math.ceil(width/tileSize),
    originX = Math.floor(width / 2),
    originY = Math.floor(height / 2),
    originXIndex = Math.floor(originX / tileSize),
    originYIndex = Math.floor(originY / tileSize),
    maxDistance = getDistance({x: 0, y: 0}, {x: originX, y: originY}),
    num2Color = d3.scaleSequential(d3.interpolateRdYlBu).domain([0, 1]);

var amount = 0.13,
    spread = 0.09,
    slant = 0,
    diversity = .08;

function parseNum(num) {
  return num.toString().replace('.', '');
}

d3.select('#info')
  .html("patch-" + parseNum(amount) + "-" + parseNum(spread) + "_" + parseNum(slant) + "-" + parseNum(diversity) + ".svg");

var root = svg.append('g');

var tiles = d3.range(numRows * numCols).map((i) => {
  var indexX = i % numCols,
      indexY = Math.floor(i/numCols),
      x = indexX * tileSize,
      y = indexY * tileSize,
      distanceToOrigin = getDistance({x: x, y: y}, {x: originX, y: originY}),
      isActive = d3.randomNormal(amount, spread)() > (distanceToOrigin/maxDistance) ? true : false;
      //isActive = distanceToOrigin < 210;

  return {
    indexX,
    indexY,
    x,
    y,
    distanceToOrigin,
    isActive
  }
});

tiles.sort((a, b) => {
  return a.distanceToOrigin - b.distanceToOrigin;
});

for(var i=0; i<tiles.length; i++) {
  var tile = tiles[i];
  var neighbors = getNeighbours(tile);
  if(neighbors.length >= 8)
    tile.isActive = true
  //tile.isActive = neighbors.length > 4 ? true : false;
}



/*for(var i=0; i<tiles.length; i++) {

  var tile = tiles[i],
      {diagonal, vertical, horizontal} = getRelevantNeighbors(tile),
      isActive = false;

  if(i <= 9) {
    tile.isActive = true;
    continue;
  }

  if((diagonal.isActive && horizontal.isActive) || (diagonal.isActive && vertical.isActive))
    tile.isActive = Math.random() > (tile.distanceToOrigin/maxDistance) ? true : false;
  else
    tile.isActive = false;  
}*/



var tile = root
  .selectAll('g')
  .data(tiles);

tile
  .enter()
  .append('g')
  .attr('transform', (d) => {
    return 'translate(' + d.x + "," + d.y + ')';
  })
  .append('rect')
  .attr('width', tileSize)
  .attr('height', tileSize)
  .attr('x', 0)
  .attr('y', 0)
  .style('fill', (d) => {
    return num2Color(d3.randomNormal(slant, diversity)())
  })
  .style('opacity', (d) => {
    if(!d.isActive) return 0;
    return .8;
    return d3.randomNormal(.5, .03)();
    return 1 - d.distanceToOrigin/510;
  })
  .filter((d) => {
    return !d.isActive;
  })
  .remove();

// returns all the neighbours
function getNeighbours(tile) {
  var neighbors = []
  for(var j=0; j<tiles.length; j++) {
    var current = tiles[j];
    if(!current.isActive) continue;
    if((Math.abs(current.indexX - tile.indexX) <= 1) && (Math.abs(current.indexY - tile.indexY) <= 1))
      neighbors.push(current)
  }
  return neighbors;
}

// returns the neighbours that are closer to the center
function getRelevantNeighbors(tile) {
  var neighborIndexX = tile.indexX > originXIndex ? tile.indexX - 1 : tile.indexX + 1,
      neighborIndexY = tile.indexY > originYIndex ? tile.indexY - 1 : tile.indexY + 1;

/*  if(tile.indexX === originXIndex) neighborIndexX = null;
  if(tile.indexY === originYIndex) neighborIndexY = null;*/

  var neighbors = {
    diagonal: {},
    vertical: {},
    horizontal: {}
  };

  for(var j=0; j<tiles.length; j++) {
    var current = tiles[j];
    if(current.indexX === neighborIndexX && current.indexY === tile.indexY)
      neighbors.horizontal = current;
    if(current.indexY === neighborIndexY && current.indexX === tile.indexX)
      neighbors.vertical = current;
    if(current.indexX === neighborIndexX && current.indexY === neighborIndexY)
      neighbors.diagonal = current;
  }

  return neighbors;
}


function getDistance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;

  return Math.sqrt( dx*dx + dy*dy );
}