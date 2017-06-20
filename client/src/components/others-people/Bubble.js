import {timer as d3_timer} from 'd3-timer';
import {easePolyInOut as d3_easePolyInOut} from 'd3-ease';

function Bubble(ctx, options) {
  let bubble = {...options};
  const duration = 1000;
  const delay = 0;

  bubble.update = function({targetX, targetY}, dontAnimate, cb) {
    bubble.targetX = targetX;
    bubble.targetY = targetY;
  }

  bubble.render = function() {
    ctx.fillStyle = bubble.fill;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.r,0,2*Math.PI);
    ctx.fill();
  }

  return bubble;
}

export default Bubble;