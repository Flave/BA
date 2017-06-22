import React, { Component } from 'react';
import { select as d3Select } from 'd3-selection';

const ASPECT_RATIO = 1.777777778;

export default class FecebookPost extends Component {
  componentDidMount() {
    var iframe = d3Select(this.root).selectAll('iframe');
    iframe.on('load', () => {
      this.props.onLoadSuccess(this.props.options.width / ASPECT_RATIO, this.props.item.id);
    });
  }

  render() {
    const { item, allLoaded, options } = this.props;
    let style = {
      top: item.y,
      left: item.x,
      opacity: allLoaded ? 1 : 0,
      height: options.width / ASPECT_RATIO
    }

    return (
      <div style={style} ref={(root) => this.root = root} className="feed__item feed__item--youtube">
        <iframe 
          width={options.width} 
          height={options.width / ASPECT_RATIO} 
          src={`https://www.youtube.com/embed/${item.id}`} 
          frameBorder="0"
          autoPlay="false"
          allowFullScreen></iframe>
      </div>
    );
  }
}