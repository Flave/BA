var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    minRadius = 20,
    maxRadius = 50;



var colorScale = d3.scaleLinear()
  .domain([minRadius, maxRadius])
  .range(["#FFEAB6", "#FFCA46"]);

var r2StrokeWidth = d3.scaleLinear()
  .domain([minRadius, maxRadius])
  .range([0.1, 2]);

var circles = [
  {x: 210, y: 230, r:80, col:"red"},
  {x: 150, y: 70, r:45, col:"green"},
  {x: 240, y: 100, r:70, col:"blue"},
  {x: 80, y: 270, r:50, col:"orange"},
  {x: 120, y: 230, r:40, col:"brown"}
]


var circles = [];
var circlesGenerated = 0;

function circleCollides(circle) {
  var collide;
  for(var cIndex=0; cIndex<circles.length; cIndex++) {
    var checkCircle = circles[cIndex];
    var dist = Math.abs(getDistance(circle, checkCircle));
    collide = dist < d3.max([circle.r, checkCircle.r]);
    if(collide) break;
  }
  return collide;
}

function generateRandomCircle() {
  return {
    x: Math.random() * 1000,
    y: Math.random() * 1000,
    r: Math.random() * 20 + 30,
    col: "red"
  }
}

function generateCircle() {
  circlesGenerated++;
  var circle = generateRandomCircle();
  if(circleCollides(circle)) {
    return generateCircle();
  }
  else
    return circle;
}

for(var i=0; i<80; i++) {
  circles.push(generateCircle());
}

console.log(circles, circlesGenerated);

var circle = svg.selectAll("g")
  .data(circles)
  .enter().append("g");


circle.append("circle")
    .attr("id", function(d, i) {return "circle-" + i})
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) {return d.r; })
    .style("fill", "none");/*
    .style("stroke", function(d) {return d.col; })*/


circle.append("path")
  .attr("d", function(circle1, i) {
    var sortedCircles = sortCirclesByAngle(circle1, getOverlappingCircles(circle1));
    if(!sortedCircles.length)
      return circlePath(circle1);
    if(sortedCircles.length === 1)
      return oneAdjacent(circle1, sortedCircles[0]);

    if(sortedCircles.length === 2)
      return twoAdjacent(circle1, sortedCircles);

    var d = "";
    sortedCircles.forEach(function(circle2, i) {
      var prevCircle = i === 0 ? sortedCircles[sortedCircles.length - 1] : sortedCircles[i - 1];
      var nextCircle = i < (sortedCircles.length - 1) ? sortedCircles[i + 1] : sortedCircles[0];
      var points = getIntersectionPoints(circle1, getIntersectionAngles(circle1, circle2), true);
      var nextPoints = getIntersectionPoints(circle1, getIntersectionAngles(circle1, nextCircle), true);
      var prevPoints = getIntersectionPoints(circle1, getIntersectionAngles(circle1, prevCircle), true);

      var finish = prevCircle === nextCircle && i === sortedCircles.length - 1;
      var angleBetweenEndAndStart = getAngleBetweenCirclePoints(circle1, points[1], nextPoints[0]);
      var overlapsPrev = doCirclesOverlap(circle2, prevCircle);
      var overlapsNext = doCirclesOverlap(circle2, nextCircle);
      var start, end;

      if(overlapsPrev)
        start = getLineIntersectionAsArray(points, prevPoints);
      else
        start = {x: points[0].x, y: points[0].y};
      if(overlapsNext)
        end = getLineIntersectionAsArray(points, nextPoints);
      else
        end = {x: points[1].x, y: points[1].y};

      d += "L " + start.x + "," + start.y + "L " + end.x + "," + end.y;

      if(!overlapsNext && angleBetweenEndAndStart > Math.PI) {
        d += "A " + circle1.r + " " + circle1.r + " 0 1 1 " + nextPoints[0].x + " " + nextPoints[0].y;
      }

      else if(!overlapsNext && angleBetweenEndAndStart < Math.PI) {
        d += "A " + circle1.r + " " + circle1.r + " 0 0 1 " + nextPoints[0].x + " " + nextPoints[0].y;
      }
    });
    return "M" + d.substr(1, d.length);
  })
  .style("stroke", "#000")
  .style("fill", "none")/*
  .style("fill", function(d) {
    return colorScale(d.r);
  })*/
  .style("stroke-width", function(d) {return r2StrokeWidth(d.r)})


function circlePath(circle){
    return 'M '+circle.x+' '+circle.y+' m -'+circle.r+', 0 a '+circle.r+','+circle.r+' 0 1,0 '+(circle.r*2)+',0 a '+circle.r+','+circle.r+' 0 1,0 -'+(circle.r*2)+',0';
}

function oneAdjacent(circle, adjacent) {
  var d = "M ";
  var angles = getClockwiseIntersactionAngles(circle, adjacent);
  var points = getIntersectionPoints(circle, angles, true);
  var angleBetween = getAngleBetweenCirclePoints(circle, points[0], points[1]);

  d += points[0].x + "," + points[0].y + "L " + points[1].x + "," + points[1].y;
  d += "A " + circle.r + " " + circle.r + " 0 1 1 " + points[0].x + " " + points[0].y;
  return d;
}

function twoAdjacent(circle, adjacentCircles) {
  var d = "";
  var circle1 = adjacentCircles[0];
  var circle2 = adjacentCircles[1];
  var angles1 = getClockwiseIntersactionAngles(circle, circle1);
  var angles2 = getClockwiseIntersactionAngles(circle, circle2);
  var points1 = getIntersectionPoints(circle, angles1, true);
  var points2 = getIntersectionPoints(circle, angles2, true);
  var overlap = doCirclesOverlap(circle1, circle2);
  var intersection, angleBetweenEndAndStart, sweep;
  var overlapsFromBehind = angles2.end > angles1.start && angles2.end < angles2.start;

  if(!overlap) {
    var anglesBetweenFirstAndSecond = getAngleBetweenCirclePoints(circle, points1[1], points2[0]);
    var anglesBetweenSecondAndFirst = getAngleBetweenCirclePoints(circle, points2[1], points1[0]);
    var sweep1 = anglesBetweenFirstAndSecond > Math.PI ? 1 : 0;
    var sweep2 = anglesBetweenSecondAndFirst > Math.PI ? 1 : 0;
    d += "M " + points1[0].x + "," + points1[0].y + "L " + points1[1].x + "," + points1[1].y;
    d += "A " + circle.r + " " + circle.r + " 0 " + sweep1 + " 1 " + points2[0].x + " " + points2[0].y;
    d += "L " + points2[0].x + "," + points2[0].y + "L " + points2[1].x + "," + points2[1].y;
    d += "A " + circle.r + " " + circle.r + " 0 " + sweep2 + " 1 " + points1[0].x + " " + points1[0].y;
    return d;
  }

  intersection = getLineIntersectionAsArray(points1, points2);
  angleBetweenEndAndStart = getAngleBetweenCirclePoints(circle, points2[1], points1[0]);
  sweep = angleBetweenEndAndStart > Math.PI ? 1 : 0;
  if(!overlapsFromBehind) {
    d += "M " + intersection.x + "," + intersection.y + "L " + points2[1].x + "," + points2[1].y;
    d += "A " + circle.r + " " + circle.r + " 0 " + sweep + " 1 " + points1[0].x + " " + points1[0].y;
    d += "L " + intersection.x + "," + intersection.y;
    return d;
  }

  angleBetweenEndAndStart = getAngleBetweenCirclePoints(circle, points1[1], points2[0]);
  sweep = angleBetweenEndAndStart > Math.PI ? 1 : 0;
  d += "M " + intersection.x + "," + intersection.y + "L " + points1[1].x + "," + points1[1].y;
  d += "A " + circle.r + " " + circle.r + " 0 " + sweep + " 1 " + points2[0].x + " " + points2[0].y;
  d += "L " + intersection.x + "," + intersection.y;
  return d;
}


function getLineIntersectionAsArray(l1, l2){
  var m1 = (l1[0].y-l1[1].y)/(l1[0].x-l1[1].x);  // slope of line 1
  var m2 = (l2[0].y-l2[1].y)/(l2[0].x-l2[1].x);  // slope of line 2
  //if(m1 - m2 < Number.EPSILON) return;
  return { 
    x: (m1 * l1[0].x - m2*l2[0].x + l2[0].y - l1[0].y) / (m1 - m2),
    y: (m1*m2*(l2[0].x-l1[0].x) + m2*l1[0].y - m1*l2[0].y) / (m2 - m1)
  };
}

function getLineIntersection(l1, l2){
  var m1 = (l1.y1-l1.y2)/(l1.x1-l1.x2);  // slope of line 1
  var m2 = (l2.y1-l2.y2)/(l2.x1-l2.x2);  // slope of line 2
  //if(m1 - m2 < Number.EPSILON) return;
  return { 
    x: (m1 * l1.x1 - m2*l2.x1 + l2.y1 - l1.y1) / (m1 - m2),
    y: (m1*m2*(l2.x1-l1.x1) + m2*l1.y1 - m1*l2.y1) / (m2 - m1)
  };
}

function getIntersectionPoints(circle, angles, asArray) {
  if(asArray)
    return [
      {
        x: Math.cos(angles.start) * circle.r + circle.x,
        y: Math.sin(angles.start) * circle.r + circle.y
      },
      {
        x: Math.cos(angles.end) * circle.r + circle.x,
        y: Math.sin(angles.end) * circle.r + circle.y
      }
    ]

  return {
    x1: Math.cos(angles.start) * circle.r + circle.x,
    y1: Math.sin(angles.start) * circle.r + circle.y,
    x2: Math.cos(angles.end) * circle.r + circle.x,
    y2: Math.sin(angles.end) * circle.r + circle.y
  }
}

function getIntersectionAngles(circle1, circle2) {
  var aSector = getSSSangle(circle2.r, getDistance(circle1, circle2), circle1.r);
  var aCenter = Math.atan2(circle2.y - circle1.y, circle2.x - circle1.x);
  return {start: aCenter - aSector, end: aCenter + aSector};
}


function getSSSangle(opposite, adjacent1, adjacent2) {
  return Math.acos((Math.pow(adjacent1, 2) + Math.pow(adjacent2, 2) - Math.pow(opposite, 2)) / (2 * adjacent1 * adjacent2));
}

function doCirclesOverlap(circle1, circle2) {
  var dist = getDistance(circle1, circle2);
  return dist < (circle1.r + circle2.r);
}

function getDistance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;

  return Math.sqrt( dx*dx + dy*dy );
}

function getOverlappingCircles(circle1) {
  var oCircles = [];

  circles.forEach(function(circle2) {
    if(circle1 === circle2) return;
    if(doCirclesOverlap(circle1, circle2)) {
      oCircles.push(circle2);
    }
  });
  return oCircles;
}

function generateCompareCircles(circle) {
  return function compare(circleA, circleB) {
    var anglesA = getClockwiseIntersactionAngles(circle, circleA);
    var anglesB = getClockwiseIntersactionAngles(circle, circleB);
    var pointsA = getIntersectionPoints(circle, anglesA, true);
    var pointsB = getIntersectionPoints(circle, anglesB, true);

    if (anglesA.start < anglesB.start)
      return -1;
    if (anglesA.start > anglesB.start)
      return 1;
    return 0;
  }
}

function getClockwiseIntersactionAngles(circle1, circle2) {
  var intersectionAngles = getIntersectionAngles(circle1, circle2);
  return {
    start: intersectionAngles.start < 0 ? intersectionAngles.start + 2 * Math.PI : intersectionAngles.start,
    end: intersectionAngles.end < 0 ? intersectionAngles.end + 2 * Math.PI : intersectionAngles.end
  }
}

// returns the angle between pointA and pointB in clockwise direction
function getClockwiseAngle(pointA, pointB) {
  var angle = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x)
  return angle < 0 ? (Math.PI - Math.abs(angle)) + Math.PI : angle;
}

function sortCirclesByAngle(circle, circles) {
  return circles.sort(generateCompareCircles(circle));
}

function getAngleBetweenCirclePoints(center, pointA, pointB) {
  var diff = getClockwiseAngle(center, pointB) - getClockwiseAngle(center, pointA);
  return diff < 0 ? diff + 2 * Math.PI : diff;
}

function getAngleBetweenCircles(center, circleA, circleB) {
  return Math.PI - (getClockwiseAngle(center, circleB) - getClockwiseAngle(center, circleA));
}

/*var circle = svg.selectAll("g")
  .data(circles)
  .enter().append("g")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

// clip objects
var cell = circle.append("path")
  .data(voronoi.polygons(circles))
    .attr("d", renderCell)
    .attr("id", function(d, i) { return "cell-" + i; });

circle.append("circle")
    .attr("id", function(d, i) {return "circle-" + i})
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) {return d.r; });

// clip paths
circle.append("clipPath")
    .attr("id", function(d, i) { return "cell-clip-" + i; })
    .append("use")
    .attr("xlink:href", function(d, i) { return "#cell-" + i; });

circle.append("clipPath")
  .attr("id", function(d, i) {return "circle-clip-" + i})
  .append("use")
  .attr("xlink:href", function(d, i) {return "#circle-" + i});

// drawn cells
circle.append("path")
  .data(voronoi.polygons(circles))
    .attr("d", renderCell)
    .attr("class", "clipped-cell")
    .attr("clip-path", function(d, i) { return "url(#circle-clip-" + i + ")"; });

// drawn circles
circle.append("circle")
    .attr("class", "clipped-circle")
    .attr("clip-path", function(d, i) { return "url(#cell-clip-" + i + ")"; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) {return d.r; })
    .style('stroke', '#000')
    .style("fill", '#fff');


function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  d3.select(this).select("circle").attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  cell = cell.data(voronoi.polygons(circles)).attr("d", renderCell);
}

function dragended(d, i) {
  d3.select(this).classed("active", false);
}

function renderCell(d) {
  return d == null ? null : "M" + d.join("L") + "Z";
}*/