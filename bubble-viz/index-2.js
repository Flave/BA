var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    minRadius = 5,
    maxRadius = 20;



var colorScale = d3.scaleLinear()
  .domain([minRadius, maxRadius])
  .range(["#FFEAB6", "#FFCA46"]);

var r2StrokeWidth = d3.scaleLinear()
  .domain([minRadius, maxRadius])
  .range([0.1, 1]);



var circles = [];
var circlesGenerated = 0;

function getDistance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;

  return Math.sqrt( dx*dx + dy*dy );
}

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
    r: Math.random() * (maxRadius-minRadius) + minRadius,
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

for(var i=0; i<450; i++) {
  circles.push(generateCircle());
}


var circle = svg.selectAll("g")
  .data(circles)
  .enter().append("g");


var filter = circle
  .append('filter')
  .attr("x", "-40%")
  .attr("y", "-40%")
  .attr("width", "160%")
  .attr("height", "160%")
  .attr('id', function(d, i) { return i; })
  .each(function(circle, i) {
    var overlappingCircles = getOverlappingCircles(circle);
    var filter = d3.select(this);
  });


filter
  .append('feGaussianBlur')
  .attr('in', 'SourceAlpha')
  .attr('stdDeviation', '2');


circle.append("circle")
    .attr("id", function(d, i) {return "circle-" + i})
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) {return d.r; })
    .attr('filter', function(d, i) {
      return "url(#" + i + ")";
    })
    .style("fill", "#000");


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