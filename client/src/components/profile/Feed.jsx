import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import FacebookPost from '../FacebookPost.jsx';
import Loader from '../Loader.jsx';
import { zoom as d3Zoom } from 'd3-zoom';
import { select as d3Select } from 'd3-selection';
import { event as d3Event } from 'd3-selection';
import _compact from 'lodash/compact';
import { randomNormal as d3RandomNormal } from 'd3-random';


window.d3RandomNormal = d3RandomNormal;

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
  }

  zoomEnd() {
    this.setState({zooming: false});
  }

  zoomStart() {
    this.setState({zooming: true});
  }


  handleItemLoad(itemHeight, itemUrl) {
    const { id } = this.props.profile;
    this.context.store.dispatch(actions.setFeedItemHeight(itemHeight, itemUrl, id));
  }

  createFeed(feed, allLoaded) {
    return feed.map((item, index) => {
      return (
        <FacebookPost allLoaded={allLoaded} onLoad={this.handleItemLoad.bind(this)} key={index} item={item}/>
      )
    })
  }

  render() {
    const {feed, loading} = this.props.profile;
    const zoomClass = this.state.zooming ? "is-zooming" : "";
    const allLoaded = (feed && !loading) ? true : false;

    return (
      <div ref={(root) => this.root = root} className="feed">
        {!allLoaded && <Loader />}
        <div ref={(canvas) => this.canvas = canvas} className={`feed__canvas ${zoomClass}`}>
          {feed && this.createFeed(feed, allLoaded)}
        </div>
      </div>
    )
  }
};

Feed.contextTypes = {
  store: PropTypes.object
}

export default Feed;