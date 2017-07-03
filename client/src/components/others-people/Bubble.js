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

    bubble.differences.sort((d1, d2) => {
      const selectedGroup1 = _find(bubble.selectedGroups, {id: d1.id});
      const selectedGroup2 = _find(bubble.selectedGroups, {id: d2.id});
      if(selectedGroup1 && selectedGroup2)
        return d1.relativeDifference - d2.relativeDifference;
      if(selectedGroup1)
        return 1;
      return -1;
    });
  }


  bubble.render = function() {
    ctx.save();
    ctx.translate(bubble.x, bubble.y);

    predictionOptions.forEach((group, i) => {
      const difference = _find(bubble.differences, {id: group.id});
      const selectedGroup = _find(bubble.selectedGroups, {id: group.id});
      const r = (bubble.r + 1.1) * (bubble.selectedGroups.length/7);

      const angle = Math.PI * 2 / predictionOptions.length * i;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const color = d3Hsl(group.color(1));

      color.opacity = difference.relativeDifference;

      if(!selectedGroup) {
       color.s = 0;
       color.opacity = .1;
      }

      
      if(bubble.isUser) {
        color.opacity = .5;
        color.s = 0;
      }

      addDimension({x,y}, bubble.r * 1.4, color);
    });


    ctx.restore();
  }


  function addDimension(center, r, color, strength) {
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