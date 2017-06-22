import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import FacebookPost from 'app/components/common/FacebookPost.jsx';
import Tweet from 'app/components/common/Tweet.jsx';
import InstagramPost from 'app/components/common/InstagramPost.jsx';
import YoutubeVideo from 'app/components/common/YoutubeVideo.jsx';
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

    this.startTimer = new Date();
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


  handleLoadSuccess(itemHeight, itemId) {
    const { id } = this.props.profile;
    // TODO: find a more elegant way to determine whether all items are loaded other than passing
    // "itemsShown" to this update call
    this.context.store.dispatch(actions.setFeedItemHeight(itemHeight, itemId, id, this.props.itemsShown));
  }

  createFeed(feed, allLoaded) {
    return feed.map((item, index) => {
      if(!item) return;
      if(item.platform === 'twitter')
        return <Tweet 
          item={item}
          key={item.id} 
          allLoaded={true}
          onLoadSuccess={this.handleLoadSuccess.bind(this)} 
          options={{width: 350}} />
      if(item.platform === 'facebook')
        return <FacebookPost  
          item={item}
          key={item.id}
          allLoaded={true} 
          onLoadSuccess={this.handleLoadSuccess.bind(this)} 
          options={{width: 350}} />
      if(item.platform === 'instagram')
        return <InstagramPost
          item={item}
          key={item.id}
          allLoaded={true} 
          onLoadSuccess={this.handleLoadSuccess.bind(this)} 
          options={{width: 350}} />
      if(item.platform === 'youtube')
        return <YoutubeVideo
          item={item}
          key={item.id}
          allLoaded={true}
          onLoadSuccess={this.handleLoadSuccess.bind(this)} 
          options={{width: 350}} />
    })
  }

  render() {
    const {feed, loading} = this.props.profile;
    const zoomClass = this.state.zooming ? "is-zooming" : "";
    const allLoaded = (feed && !loading) ? true : false;

    if(allLoaded && this.startTimer) {
      const endTimer = new Date();
      console.log("Loading time: " + (endTimer - this.startTimer));
      this.startTimer = undefined;
    }

    console.log("Creating feed");

    return (
      <div ref={(root) => this.root = root} className="feed">
        {!allLoaded && <Loader />}
        <div ref={(canvas) => this.canvas = canvas} className={`feed__canvas ${zoomClass}`}>
          {feed && this.createFeed(feed.slice(0, this.props.itemsShown), allLoaded)}
        </div>
      </div>
    )
  }
};

Feed.contextTypes = {
  store: PropTypes.object
}

export default Feed;