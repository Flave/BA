function Bubble(ctx, options) {
  let bubble = {...options};

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