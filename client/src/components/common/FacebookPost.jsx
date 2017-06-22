import React, { Component } from 'react';
//import {FacebookProvider, EmbeddedPost} from 'react-facebook';
import { select as d3Select } from 'd3-selection';

 
export default class FecebookPost extends Component {
  componentDidMount() {
    FB.XFBML.parse();
    var iframe = d3Select(this.root).selectAll('iframe');
    iframe.on('load', () => {
      // TODO: Make interval to check back until height is set
      window.setTimeout(() => {
        const height = parseInt(iframe.node().style.height.replace("px", ""));
        this.props.onLoadSuccess(height, this.props.item.id);
      }, 4);
    })
  }

  render() {
    const { item, allLoaded, options } = this.props;
    let style = {
      top: item.y,
      left: item.x,
      opacity: allLoaded ? 1 : 0
    }

    return (
      <div style={style} ref={(root) => this.root = root} className="feed__item">
        <div className="fb-post" data-width={options.width} data-href={this.props.item.id}></div>
      </div>
    );
  }
}