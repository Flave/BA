var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var pixelSize = 10;
var halfPixel = pixelSize / 2;
var radius = 1;
var x = 100;
var y = 100;




ctx.save();
ctx.translate(100, 100);

ctx.fillStyle = "#009";
for(var col=-radius; col <= radius; col++) {
  for(var row=-radius; row <= radius; row++) {
    var x = col * pixelSize + halfPixel;
    var y = row * pixelSize + halfPixel;
    var distToCenter = getDistance({x: x, y: y}, {x: 0, y: 0});
    var scaleFactor = distToCenter / 3;
    if(distToCenter <= Math.floor(pixelSize * radius)) {
      ctx.fillRect(x - halfPixel, y - halfPixel, pixelSize-1, pixelSize-1);
    }
  }
}
ctx.strokeStyle = "#f00";
circle(ctx, 0, 0, pixelSize * radius);
ctx.restore();

function getDistance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;

  return Math.sqrt( dx*dx + dy*dy );
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x,y,r,0,2*Math.PI);
  ctx.stroke();
}