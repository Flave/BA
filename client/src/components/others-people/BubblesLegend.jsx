import React, { Component } from 'react';
import predictions from 'root/constants/predictions';
import predictionOptions from 'root/constants/predictionOptions';
import Bubble from './Bubble';

const WIDTH = 349;
const HEIGHT = 370;
const PIX_RATIO = .2;
const INVERT_RATIO = 1 / PIX_RATIO;
const pixSize = [WIDTH * PIX_RATIO, HEIGHT * PIX_RATIO];

const bubbleSpecs = [
  {
    differences: [
      {
        id: 'female',
        relativeDifference: .3
      },
      {
        id: 'age',
        relativeDifference: .3
      },
      {
        id: 'intelligence',
        relativeDifference: .3
      },
      {
        id: 'satisfaction_life',
        relativeDifference: .3
      },
      {
        id: 'politics',
        relativeDifference: .3
      },
      {
        id: 'religion',
        relativeDifference: .3
      },
      {
        id: 'big5',
        relativeDifference: .3
      }
    ],
    isUser: true,
    x: WIDTH * .49 * PIX_RATIO,
    y: HEIGHT * .56 * PIX_RATIO,
    r: 7
  },
  {
    differences: [
      {
        id: 'female',
        relativeDifference: .1
      },
      {
        id: 'age',
        relativeDifference: .3
      },
      {
        id: 'intelligence',
        relativeDifference: .1
      },
      {
        id: 'satisfaction_life',
        relativeDifference: .3
      },
      {
        id: 'politics',
        relativeDifference: .2
      },
      {
        id: 'religion',
        relativeDifference: .2
      },
      {
        id: 'big5',
        relativeDifference: .1
      }
    ],
    x: WIDTH * .55 * PIX_RATIO,
    y: HEIGHT * .9 * PIX_RATIO,
    r: 6
  },
  {
    differences: [
      {
        id: 'female',
        relativeDifference: .9
      },
      {
        id: 'age',
        relativeDifference: .8
      },
      {
        id: 'intelligence',
        relativeDifference: .9
      },
      {
        id: 'satisfaction_life',
        relativeDifference: .9
      },
      {
        id: 'politics',
        relativeDifference: .7
      },
      {
        id: 'religion',
        relativeDifference: .9
      },
      {
        id: 'big5',
        relativeDifference: 1
      }
    ],
    x: WIDTH * .4 * PIX_RATIO,
    y: HEIGHT * .05 * PIX_RATIO,
    r: 3
  }
]

class BubblesLegend extends Component {
  componentDidMount() {
    const ctx = this.canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    this.updateBubbles();
  }

  componentDidUpdate() {
    this.updateBubbles();
  }

  updateBubbles() {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    const selectedGroups = this.getSelectedGroups();

    ctx.fillStyle = "#fafafa";
    ctx.rect(0, 0, pixSize[0], pixSize[1]);
    ctx.fill();
    bubbleSpecs.forEach(bubbleSpec => 
      Bubble(ctx, bubbleSpec)
        .update({}, selectedGroups)
        .render()
    )
    ctx.drawImage(canvas, 0, 0, pixSize[0], pixSize[1], 0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = "#888";
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(bubbleSpecs[0].x * INVERT_RATIO - 8, bubbleSpecs[0].y * INVERT_RATIO - 48);
    ctx.lineTo(bubbleSpecs[2].x * INVERT_RATIO + 5, bubbleSpecs[2].y * INVERT_RATIO + 25);
    ctx.moveTo(bubbleSpecs[0].x * INVERT_RATIO + 10, bubbleSpecs[0].y * INVERT_RATIO + 49);
    ctx.lineTo(bubbleSpecs[1].x * INVERT_RATIO - 5, bubbleSpecs[1].y * INVERT_RATIO - 35);
    ctx.stroke();
  }

  getSelectedGroups() {
    return predictionOptions.filter(group =>
      this.props.predictionsState.filter(prediction => 
        group.properties.indexOf(prediction.id) !== -1 && prediction.value
      ).length
    );
  }

  render() {
    return (
      <div className="bubbles-legend">
        <canvas
          width={WIDTH}
          height={HEIGHT}
          className="bubbles-legend__canvas" ref={el => this.canvas = el}/>
        <div 
          style={{
            right: WIDTH - bubbleSpecs[2].x * INVERT_RATIO + 20, 
            top: bubbleSpecs[2].y * INVERT_RATIO + 20,
            textAlign: "right"
          }}
          className="bubbles-legend__textbox">
          <h4 className="bubbles-legend__textbox-title">Vivid color</h4>
          <p className="bubbles-legend__textbox-copy">Less similar</p>
        </div>
        <div 
          style={{
            left: bubbleSpecs[2].x * INVERT_RATIO + 40, 
            top: bubbleSpecs[2].y * INVERT_RATIO + 45
          }}
          className="bubbles-legend__textbox">
          <h4 className="bubbles-legend__textbox-title">Further away</h4>
          <p className="bubbles-legend__textbox-copy">Less similar in  selected predictions</p>
        </div>
        <div 
          style={{
            right: WIDTH - bubbleSpecs[1].x * INVERT_RATIO + 50, 
            top: bubbleSpecs[1].y * INVERT_RATIO - 10,
            textAlign: "right"
          }}
          className="bubbles-legend__textbox">
          <h4 className="bubbles-legend__textbox-title">Big Bubble</h4>
          <p className="bubbles-legend__textbox-copy">More similar<br/> overall</p>
        </div>
        <div 
          style={{
            right: WIDTH - bubbleSpecs[0].x * INVERT_RATIO + 50,
            top: bubbleSpecs[0].y * INVERT_RATIO - 8,
            textAlign: "right"
          }}
          className="bubbles-legend__textbox">
          <h4 className="bubbles-legend__textbox-title">YOUR<br/>BUBBLE</h4>
        </div>
      </div>
    )
  }
};

export default BubblesLegend;