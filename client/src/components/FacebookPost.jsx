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
    
  }

  render() {
    return (
      <div ref={(root) => this.root = root} className="feed__item">
        <div className="fb-post" data-href={this.props.url}></div>
        {/*<FacebookProvider appId="1754125368233773">
                  <EmbeddedPost href={this.props.url} width="400" />
                </FacebookProvider>*/}
      </div>
    );
  }
}

{/*<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsimonesen.19%2Fposts%2F10203232440967798&width=500" width="500" height="181" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fjonhopkinsmusic%2Fvideos%2F1695634047119458%2F&show_text=0&width=560" width="560" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>*/}