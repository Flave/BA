import predictions from 'root/constants/predictions';
import predictionGroups from 'root/constants/predictionGroups';
import predictionOptions from 'root/constants/predictionOptions';
import { getSelectedPredictions, calculateSimilarity } from 'app/utility';
import { getDistance } from 'app/utility';
import seedrandom from 'seedrandom';
import _find from 'lodash/find';
import { max as d3Max } from 'd3-array';
import { hsl as d3Hsl } from 'd3-color';


// var cols = ["#3BE1BC","#5164B3","#1BAEAE","#4FC2E3","#FF6686","#FF9292","#FFC99A"];


function Bubble(ctx, options, user) {
  let bubble = {...options};

  bubble.update = function({targetX, targetY}, selectedGroups) {
    bubble.targetX = targetX;
    bubble.targetY = targetY;
    bubble.selectedGroups = selectedGroups;
  }


  bubble.render = function() {
    ctx.save();
    ctx.translate(bubble.x, bubble.y);

    predictionOptions.forEach((group, i) => {
      const difference = _find(bubble.differences, {id: group.id});
      const angle = Math.PI * 2 / predictionOptions.length * i;
      const x = Math.cos(angle) * bubble.r + 1.1;
      const y = Math.sin(angle) * bubble.r + 1.1;
      const col = d3Hsl(group.col(1));
      col.s = difference.relativeDifference;
      col.opacity = difference.relativeDifference;
      if(bubble.isUser) {
        col.opacity = 1;
        col.s = 0;
      }
      addDimension({x,y}, bubble.r * 1.4, col);
    });

    ctx.restore();
  }


  function addDimension(center, r, color) {
    const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, r);
    //color.opacity = .7;
    grad.addColorStop(0, color + "");
    color.opacity = 0;
    grad.addColorStop(1, color + "");

    ctx.beginPath();
    ctx.fillStyle = grad;
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