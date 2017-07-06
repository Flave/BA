import React, { Component } from 'react';
import { select as d3Select } from 'd3-selection';
import LoadingItem from 'app/components/profile-feed/LoadingItem.jsx';

const ASPECT_RATIO = 1.777777778;

export default class FecebookPost extends Component {
  componentDidMount() {
    var iframe = d3Select(this.root).selectAll('iframe');
    iframe.on('load', () => {
      this.props.onLoadSuccess(this.props.options.width / ASPECT_RATIO, this.props.item);
    });
  }

  render() {
    const { item, show, options } = this.props;
    let itemStyle = {
      top: item.y === null ? item.siblingTop : item.y,
      left: item.x
    }
    const containerStyle = {
      opacity: show ? 1 : 0
    }

    return (
      <div style={itemStyle} className="feed__item feed__item--youtube">
        {!show && <LoadingItem item={item} />}
        <div ref={(root) => this.root = root} style={containerStyle} className="feed__item-container">
          <iframe 
            width={options.width} 
            height={options.width / ASPECT_RATIO} 
            src={`https://www.youtube.com/embed/${item.id}`} 
            frameBorder="0"
            autoPlay="false"
            allowFullScreen></iframe>
        </div>
      </div>
    );
  }
}