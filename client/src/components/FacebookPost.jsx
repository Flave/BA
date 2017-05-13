import React, { Component } from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';
import { select as d3Select } from 'd3-selection';

 
export default class FecebookPost extends Component {
/*  componentDidMount() {
    setTimeout(function() {
      const rootEl = this.root;
      d3Select(this.root).selectAll('iframe').style('opacity', 0.3)
      d3Select(this.root).selectAll('iframe').on('load', function() {

        console.log(rootEl.clientHeight);
      });

    }.bind(this), 50);
  }*/

  componentDidMount() {
    FB.XFBML.parse();
    var iframe = d3Select(this.root).selectAll('iframe');
    iframe.on('load', () => {
      const height = parseInt(iframe.node().style.height.replace("px", ""));
      this.props.onLoad(height, this.props.item.url);
    })
  }

  render() {
    const { item } = this.props;
    let style = {
      top: item.y,
      left: item.x
    }
    return (
      <div style={style} ref={(root) => this.root = root} className="feed__item">
        <div className="fb-post" data-width="350" data-href={this.props.item.url}></div>
      </div>
    );
  }
}

{/*
<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fjonhopkinsmusic%2Fvideos%2F1695634047119458%2F&show_text=0&width=560" width="560" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>*/}