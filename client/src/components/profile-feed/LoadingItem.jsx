import React, { Component } from 'react';
import _find from 'lodash/find';
import * as d3Selection from 'd3-selection';
import { range as d3Range } from 'd3-array';
import { ui, predictionOptions } from 'root/constants';
import Loader from 'app/components/common/Loader.jsx';
import { timer as d3Timer } from 'd3-timer';

const SIZE = 100;
const NUM_COLS = 5;
const NUM_ROWS = NUM_COLS;
const TILE_SIZE = SIZE / NUM_COLS;
let duration = 1000;

class ItemLoader extends Component {
  componentDidMount() {
    //this.ctx = this.canvas.getContext('2d');

/*    var dx = x - coin.position.x,
        dy = y - coin.position.y,
        ox = coin.position.x,
        oy = coin.position.y;*/

    //this.timer = d3Timer(this.frame.bind(this));
  }

  frame(elapsed) {
    var t = elapsed / duration;
    this.display(t);
    //coin.position.x =  ox + (dx * d3_easePolyInOut(t, 3));
    if(elapsed > duration) {
      this.timer.restart(this.frame.bind(this));
    }   
  }

  display(t) {
    this.ctx.fillStyle = `rgba(0, 0, 0, ${t})`;
    this.ctx.rect(0, 0, 20, 20);
    this.ctx.fill();
/*    for(let i=0; i<NUM_COLS*NUM_ROWS; i++) {
      const colIndex = i % NUM_COLS;
      const rowIndex = Math.floor(i/NUM_COLS);
      const x = colIndex * TILE_SIZE;
      const y = rowIndex * TILE_SIZE;
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.fillStyle = `rgba(0, 0, 0, ${t})`;
      this.ctx.rect(0, 0, 20, 20);
      this.ctx.fill();
      this.ctx.restore();
    }*/
  }


  componentWillUnmount() {
    //this.timer.stop();
  }


  render() {
    const { item } = this.props;
    const top = item.y === null ? -175 : 175;
    const left = ui.FEED_ITEM_WIDTH/2 - SIZE/2;
/*    return <canvas 
        ref={el => this.canvas = el}
        className="feed__item-loader"
        style={{top, left}}
        width={SIZE}
        height={SIZE}/>*/

    return (
      <div 
        style={{
          top, left,
          position: "absolute",
          animationDelay: Math.random() * 200
        }}
        className="bit-spinner" />
    )
  }
};

export default ItemLoader;