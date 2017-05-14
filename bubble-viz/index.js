var svg = d3.select("#canvas"),
    minRadius = 40,
    maxRadius = 60;


var colorScale = d3.scaleLinear()
  .domain([minRadius, maxRadius])
  .range(["#FFEAB6", "#FFCA46"]);

var r2StrokeWidth = d3.scaleLinear()
  .domain([minRadius, maxRadius])
  .range([0.1, 1]);

var circles = generateCircles(50);


var root = svg.append('g')

var circle = root
  .selectAll("g")
  .data(circles)
  .enter()
  .append("g")/*
  .attr("clip-path", function(d, i) {
    return "url(#clip-circle-" + i + ")";
  })*/

var circleMask = root
  .append("defs")
  .selectAll('clipPath')
  .data(circles)
  .enter()
  .append("clipPath")
  .attr("id", function(d, i) {return "clip-circle-" + i;})


circleMask.append("path")
  .attr('id', "blur")
  .attr("d", calculateBubblePath);

var filter = svg
  .append('filter')
  .attr("x", "-40%")
  .attr("y", "-40%")
  .attr("width", "160%")
  .attr("height", "160%")
  .attr('id', "bubble-filter");

circle.append("path")
  .attr("d", calculateBubblePath)
  .style("fill", "#FF8AF2")
  .style("stroke", "#000")


/*
  Circle Generation
*/

function generateCircles(num) {
  var circles = [];
  for(var i=0; i<num; i++) {
    circles.push(generateCircle(circles));
  }

  return circles;
}

function circleCollides(circle, circles) {
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
  const centerX = 1440/2;
  const centerY = 1024/2;
  const angle = Math.random() * Math.PI * 2;
  const radius = d3.randomNormal(500, 80)();

  return {
    x: Math.cos(angle) * radius + centerX,
    y: Math.sin(angle) * radius + centerY,
    r: Math.random() * (maxRadius-minRadius) + minRadius
  }
}

function generateCircle(circles) {
  var circle = generateRandomCircle();
  if(circleCollides(circle, circles)) {
    return generateCircle(circles);
  }
  else
    return circle;
}



/*
  Bubble Creation
*/

function calculateBubblePath(circle, i) {
  var sortedCircles = sortCirclesByAngle(circle, getOverlappingCircles(circle));
  if(!sortedCircles.length)
    return circlePath(circle);
  if(sortedCircles.length === 1)
    return oneAdjacent(circle, sortedCircles[0]);

  if(sortedCircles.length === 2)
    return twoAdjacent(circle, sortedCircles);
  return multipleAdjacent(circle, sortedCircles);
}

function multipleAdjacent(circle, adjacent) {
  var d = "";
  adjacent.forEach(function(circle2, i) {
    var prevCircle = i === 0 ? adjacent[adjacent.length - 1] : adjacent[i - 1];
    var nextCircle = i < (adjacent.length - 1) ? adjacent[i + 1] : adjacent[0];
    var points = getIntersectionPoints(circle, getIntersectionAngles(circle, circle2), true);
    var nextPoints = getIntersectionPoints(circle, getIntersectionAngles(circle, nextCircle), true);
    var prevPoints = getIntersectionPoints(circle, getIntersectionAngles(circle, prevCircle), true);

    var finish = prevCircle === nextCircle && i === adjacent.length - 1;
    var angleBetweenEndAndStart = getAngleBetweenCirclePoints(circle, points[1], nextPoints[0]);
    var overlapsPrev = doCirclesOverlap(circle2, prevCircle);
    var overlapsNext = doCirclesOverlap(circle2, nextCircle);
    var start, end;

    if(overlapsPrev)
      start = getLineIntersection(points, prevPoints);
    else
      start = {x: points[0].x, y: points[0].y};
    if(overlapsNext)
      end = getLineIntersection(points, nextPoints);
    else
      end = {x: points[1].x, y: points[1].y};

    d += "L " + start.x + "," + start.y + "L " + end.x + "," + end.y;

    if(!overlapsNext && angleBetweenEndAndStart > Math.PI) {
      d += "A " + circle.r + " " + circle.r + " 0 1 1 " + nextPoints[0].x + " " + nextPoints[0].y;
    }

    else if(!overlapsNext && angleBetweenEndAndStart < Math.PI) {
      d += "A " + circle.r + " " + circle.r + " 0 0 1 " + nextPoints[0].x + " " + nextPoints[0].y;
    }
  });
  return "M" + d.substr(1, d.length);
}

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

  intersection = getLineIntersection(points1, points2);
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


function getLineIntersection(l1, l2){
  var m1 = (l1[0].y-l1[1].y)/(l1[0].x-l1[1].x);  // slope of line 1
  var m2 = (l2[0].y-l2[1].y)/(l2[0].x-l2[1].x);  // slope of line 2
  //if(m1 - m2 < Number.EPSILON) return;
  return { 
    x: (m1 * l1[0].x - m2*l2[0].x + l2[0].y - l1[0].y) / (m1 - m2),
    y: (m1*m2*(l2[0].x-l1[0].x) + m2*l1[0].y - m1*l2[0].y) / (m2 - m1)
  };
}

function getIntersectionPoints(circle, angles) {
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

/*
  Generates a function that can be used to compare circles for clockwise 
  ordering around a given point
*/
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

/*
  Returns the angles in which circle2 intersects circle1 in clockwise order
*/
function getClockwiseIntersactionAngles(circle1, circle2) {
  var intersectionAngles = getIntersectionAngles(circle1, circle2);
  return {
    start: intersectionAngles.start < 0 ? intersectionAngles.start + 2 * Math.PI : intersectionAngles.start,
    end: intersectionAngles.end < 0 ? intersectionAngles.end + 2 * Math.PI : intersectionAngles.end
  }
}

/*
  Returns the angle between pointA and pointB in clockwise direction
*/
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