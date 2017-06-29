import predictions from 'root/constants/predictions';
import predictionGroups from 'root/constants/predictionGroups';
import { getDistance } from 'app/utility';
import seedrandom from 'seedrandom';

function hexToRgba(hex, opacity){
  var hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
};

var cols = ["#9BD7E1", "#4697FE", "#FFD24C"]

function Bubble(ctx, options) {
  let bubble = {...options};
  const duration = 1000;
  const delay = 0;
  const random = new Math.seedrandom(bubble.id);

  bubble.update = function({targetX, targetY, selectedProperties}) {
    bubble.targetX = targetX;
    bubble.targetY = targetY;
    bubble.selectedProperties = selectedProperties;
  }

  bubble.render = function() {
    ctx.save();
    ctx.translate(bubble.x, bubble.y);
    ctx.beginPath();
    ctx.fillStyle = bubble.fill;
    ctx.arc(0, 0, Math.floor(bubble.r), 0, 2*Math.PI);
    ctx.fill(); 
    ctx.restore();
  }

  // bubble.render = function() {
  //   const centerX = Math.floor(bubble.x);
  //   const centerY = Math.floor(bubble.y);
  //   const radius = Math.floor(bubble.r);

  //   ctx.save();
  //   ctx.translate(centerX, centerY);

  //   for(let x = -radius; x < radius; x++) {
  //     for(let y = -radius; y < radius; y++) {
  //       const dist = Math.floor(getDistance({x: 0, y: 0}, {x, y}));// Math.sqrt(Math.pow(centerX - x, 2), Math.pow(centerY - y, 2));

  //       if(dist < radius) {
  //         Math.seedrandom(`${bubble.id}-${x}-${y}`);
  //         ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * .1 + .6})`;
  //         ctx.fillRect(x, y, 1, 1);
  //       }
  //     }
  //   }
  //   ctx.restore();    
  // }

  // bubble.render = function() {
  //   ctx.save();
  //   ctx.translate(Math.floor(bubble.x), Math.floor(bubble.y));
  //   addDimension(polarPosition({x:0, y:0}, bubble.r, .5, .8), bubble.r * 1.5, 0, 0, cols[0])
  //   // addDimension(polarPosition({x:0, y:0}, bubble.r, 1.3, .2), bubble.r * 1.8, 0, 0, cols[1])
  //   // addDimension(polarPosition({x:0, y:0}, bubble.r, 1.3, .5), bubble.r * 1.2, 0, 0, cols[2])
  //   ctx.restore();
  // }


  // draws a circle at position 0 0 with a gradient that starts at the point specified
  // by rOffset and angleOffset and ends in center
  function addDimension(center, r, rOffset, angleOffset, color, strength) {
    const grad = createGradient(center, r, rOffset, angleOffset, color, strength);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, Math.floor(bubble.r), 0, 2*Math.PI);
    ctx.fill();    
  }

  function createGradient(center, r, rOffset, angleOffset, color, strength) {
    const offset = polarPosition(center, r, rOffset, angleOffset);
    const grad = ctx.createRadialGradient(offset.x, offset.y, 0, center.x, center.y, r);
    grad.addColorStop(0, hexToRgba(color, 1));
    grad.addColorStop(1, hexToRgba(color, 0));
    return grad;
  }

  function cartesianPosition(xRatio, yRatio) {
    return {
      x: xRatio * bubble.r * 2 - bubble.r,
      y: yRatio * bubble.r * 2 - bubble.r
    };
  }

  function polarPosition(center, r, rOffset, angleOffset) {
    return {
      x: center.x + Math.cos(Math.PI * 2 * angleOffset) * rOffset * r,
      y: center.y + Math.sin(Math.PI * 2 * angleOffset) * rOffset * r
    }
  }

  return bubble;
}

export default Bubble;