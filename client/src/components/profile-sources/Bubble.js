function Bubble(ctx, options) {
  let bubble = {...options};

  bubble.update = function({targetX, targetY}, dontAnimate, cb) {
    bubble.targetX = targetX;
    bubble.targetY = targetY;
  }

  bubble.render = function() {
    ctx.save();
    ctx.translate(bubble.x, bubble.y);
    ctx.fillStyle = bubble.fill;
    ctx.beginPath();
    ctx.arc(0, 0, bubble.r,0,2*Math.PI);
    if(bubble.hasThumb) {
      ctx.clip();
      var img = window.document.getElementById(`subs-vis__thumb--${bubble.id}`);
      if(img)
        ctx.drawImage(img, -bubble.r, -bubble.r, bubble.r * 2, bubble.r * 2);
    } else {
      ctx.fill();
    }
    ctx.restore();
  }

  return bubble;
}

export default Bubble;