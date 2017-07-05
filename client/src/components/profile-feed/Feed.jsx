import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import FacebookPost from 'app/components/common/posts/FacebookPost.jsx';
import Tweet from 'app/components/common/posts/Tweet.jsx';
import InstagramPost from 'app/components/common/posts/InstagramPost.jsx';
import YoutubeVideo from 'app/components/common/posts/YoutubeVideo.jsx';
import Loader from 'app/components/common/Loader.jsx';
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


  handleLoadSuccess(itemHeight, item) {
    const { profile } = this.props;
    this.context.store.dispatch(actions.receiveFeedItem(item, itemHeight, profile.id, profile));
  }

  createFeed() {
    const { profile, itemsShown, batchStartIndex, loading } = this.props;
    const feed = profile.feed.slice(0, itemsShown);

    return feed.map((item, index) => {
      let show = true;

      // only show items that belong to a earlier batch or all if all loaded
      if(loading && index >= batchStartIndex)
        show = false;

      //console.log(index, batchStartIndex, loading, show);

      if(item.platform === 'twitter')
        return <Tweet 
          item={item}
          key={item.id} 
          show={show}
          onLoadSuccess={this.handleLoadSuccess.bind(this)} 
          options={{width: 350}} />
      if(item.platform === 'facebook')
        return <FacebookPost  
          item={item}
          key={item.id}
          show={show}
          onLoadSuccess={this.handleLoadSuccess.bind(this)} 
          options={{width: 350}} />
      if(item.platform === 'instagram')
        return <InstagramPost
          item={item}
          key={item.id}
          show={show}
          onLoadSuccess={this.handleLoadSuccess.bind(this)} 
          options={{width: 350}} />
      if(item.platform === 'youtube')
        return <YoutubeVideo
          item={item}
          key={item.id}
          show={show}
          onLoadSuccess={this.handleLoadSuccess.bind(this)} 
          options={{width: 350}} />
    })
  }

  render() {
    const { loading, batchStartIndex } = this.props;
    const { feed } = this.props.profile;
    const zoomClass = this.state.zooming ? "is-zooming" : "";
    const className = `feed ${loading ? "is-loading" : ""}`;

    return (
      <div onClick={() => console.log('click')} ref={(root) => this.root = root} className={className}>
        {(loading) && <Loader copy="Loading Feed" />}
        <div onMouseUp={() => console.log('mouse up')} ref={(canvas) => this.canvas = canvas} className={`feed__canvas ${zoomClass}`}>
          {feed && this.createFeed()}
        </div>
      </div>
    )
  }
};

Feed.contextTypes = {
  store: PropTypes.object
}

export default Feed;