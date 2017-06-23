/*import React, { Component } from 'react';
//import {FacebookProvider, EmbeddedPost} from 'react-facebook';


 
export default class FecebookPost extends Component {
  componentDidMount() {
    FB.XFBML.parse();
    var iframe = d3Select(this.root).selectAll('iframe');
    iframe.on('load', () => {
      // TODO: Make interval to check back until height is set
      window.setTimeout(() => {
        const height = parseInt(iframe.node().style.height.replace("px", ""));
        this.props.onLoadSuccess(height, this.props.item);
      }, 4);
    });
  }

  render() {
    const { item, show, options } = this.props;
    let style = {
      top: item.y,
      left: item.x,
      opacity: show ? 1 : 0
    }

    return (
      <div style={style} ref={(root) => this.root = root} className="feed__item feed__item--facebook">
        <div className="fb-post" data-width={options.width} data-href={this.props.item.id}></div>
      </div>
    );
  }
}*/



import React, {Component, PropTypes} from 'react';
import { select as d3Select } from 'd3-selection';
import { development as authConfig } from 'root/config/auth';

const callbacks = [];

function loadScript(cb) {
  if(callbacks.length === 0) {
    callbacks.push(cb);
    window.fbAsyncInit = () => {
      FB.init({ // eslint-disable-line no-undef
        appId: authConfig.clientID,
        xfbml: true,
        version: 'v2.9',
      });
      callbacks.forEach(cb => cb());
    };

    // Load the SDK asynchronously
    ((d, s, id) => { // eslint-disable-line id-length
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = `//connect.facebook.net/en_US/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');    
  } else {
    callbacks.push(cb);
  }
}

export default class FBEmbedPost extends Component {

  static propTypes = {
    item: PropTypes.object.isRequired,
    options: PropTypes.object,
    show: PropTypes.bool,
  }

  static defaultProps = {
    options: {width: 350},
    show: true
  }

  constructor(props) {
    super(props);
    this.parse = this.parse.bind(this);
  }


  parse() {
    window.FB.XFBML.parse(this.root);
    const iframe = d3Select(this.root).selectAll('iframe');
    iframe.on('load', () => {
      // TODO: Make interval to check back until height is set
      window.setTimeout(() => {
        const height = parseInt(iframe.node().style.height.replace("px", ""));
        this.props.onLoadSuccess(height, this.props.item);
      }, 4);
    });
  }

  componentDidMount() {
    if(window.FB)
      this.parse();
    else
      loadScript(this.parse);
  }

  render() {
    const { item, show, options } = this.props;
    let style = {
      top: item.y,
      left: item.x,
      opacity: show ? 1 : 0
    }

    return (
      <div style={style} ref={(root) => this.root = root} className="feed__item feed__item--facebook">
        <div id="fb-root"></div>
        <div className="fb-post" data-href={item.id} data-width={options.width}></div>
      </div>
    );
  }
}
