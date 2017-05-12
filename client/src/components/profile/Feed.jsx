import React, { Component } from 'react';
import * as actions from '../../actions';
import FacebookPost from '../FacebookPost.jsx';
import { zoom as d3Zoom } from 'd3-zoom';
import { select as d3Select } from 'd3-selection';
import { event as d3Event } from 'd3-selection';
import _compact from 'lodash/compact';
import { randomNormal as d3RandomNormal } from 'd3-random';

const GRID_WIDTH = 400;
const GRID_PADDING = 20;

class Feed extends Component {
  constructor(props) {
    super(props);
    this.zoomed = this.zoomed.bind(this);
    this.zoomEnd = this.zoomEnd.bind(this);
    this.zoomStart = this.zoomStart.bind(this);
    this.state = {
      zooming: false
    }
  }

  componentDidMount() {
    this.zoom = d3Zoom()
      .scaleExtent([0.1, 1])
      .on('zoom', this.zoomed)
      .on('start', this.zoomStart)
      .on('end', this.zoomEnd);

    d3Select(this.root)
      .call(this.zoom);
  }

  zoomed() {
    const { transform } = d3Event;
    d3Select(this.canvas).style("transform", "translate(" + transform.x + "px," + transform.y + "px) scale(" + transform.k + ")");

    d3Select(this.root)
      .selectAll('.feed__canvas > div')/*
      .style('filter', () => {

        return `blur(${1/Math.pow(transform.k, 2)}px)`
      })
      .style('-webkit-filter', () => {
        return `blur(${1/Math.pow(transform.k, 2)}px)`
      })*/;
  }

  zoomEnd() {
    this.setState({zooming: false});
  }

  zoomStart() {
    this.setState({zooming: true});
  }

  wheel() {
    console.log("wheeeled");
  }

  getFeedPositions(feed) {

  }

  /*
    Gets the col index around which to cluster the feed items
  */
  getFeedOrigin(feed) {
  }

  generateGridPositions(feed) {
    const width = window.innerWidth;
    const height = window.innerWidth;
    const centerIndex = Math.floor(width / GRID_WIDTH);
    const oldPositions = _compact(feed.map(item => item.colIndex !== undefined ? [item.colIndex, item.top] : undefined)); //[[colIndex, top]]
    let newPositions = [];
    //const colIndexBounds = d3Extent(oldPositions, pos => pos.colIndex);

    feed.forEach((item) => {
      if(item.colIndex !== undefined) newPositions.push(item);
      let colIndex = Math.floor(d3RandomNormal(centerIndex, 1));
      const itemsInCol = oldPositions.find(pos => pos.colIndex === colIndex);
      if(itemsInCol && (itemsInCol.length === 0))
        return d3RandomNormal(height/2, 10);
    });
  }


  generateColumns(feed) {
    
  }


  createFeed(feed) {
    this.generateGridPositions(feed);
    return feed.map((feedItem, index) => {
      return (
        <FacebookPost key={index} url={feedItem.url}/>
      )
    })
  }

  render() {
    const {feed} = this.props;
    const zoomClass = this.state.zooming ? "is-zooming" : "";

    return (
      <div ref={(root) => this.root = root} className="feed">
        {!feed && <div>Loading</div>}
        {/*<div ref={(canvas) => this.canvas = canvas} className={`feed__canvas ${zoomClass}`}>*/}
          {feed && this.createFeed(feed)}
        {/*</div>*/}
      </div>
    )
  }
};

export default Feed;