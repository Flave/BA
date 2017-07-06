import React, {Component, PropTypes} from 'react';
import { select as d3Select } from 'd3-selection';
import { development as authConfig } from 'root/config/auth';
import LoadingItem from 'app/components/profile-feed/LoadingItem.jsx';

const callbacks = [];
/*const fbRoot = document.createElement('div');

fbRoot.setAttribute('id', 'fb-root');
window.document.body.appendChild(fbRoot);*/

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
    this.onIframeLoad = this.onIframeLoad.bind(this);
  }


  parse() {
    window.FB.XFBML.parse(this.root);
    const iframe = d3Select(this.root).selectAll('iframe');
    iframe.on('load', this.onIframeLoad);
  }

  onIframeLoad() {
    const iframe = d3Select(this.root).selectAll('iframe');
    this.heightCheckInterval = window.setInterval(checkHeightAndReturn.bind(this), 100);
    let height = 0;
    let lastHeight = 0;
    let heightStableSince = 0;

    // check checking height until it is set (iframe fully rendered)
    function checkHeightAndReturn() {
      const iframe = d3Select(this.root).selectAll('iframe');
      lastHeight = height;
      height = parseInt(iframe.node().style.height.replace("px", ""));
      if(height > 0 && heightStableSince > 3) {
        this.props.onLoadSuccess(height, this.props.item);
        window.clearInterval(this.heightCheckInterval);
      }

      if(height === lastHeight) 
        heightStableSince += 1;
      else
        heightStableSince = 0;
    }
  }

  componentDidMount() {
    if(window.FB)
      this.parse();
    else
      loadScript(this.parse);
  }

  componentWillUnmount() {
    window.clearInterval(this.heightCheckInterval);
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
      <div style={itemStyle} className="feed__item feed__item--facebook">
        {!show && <LoadingItem item={item} />}
        <div ref={(root) => this.root = root} style={containerStyle} className="feed__item-container">
          <div className="fb-post" data-href={item.id} data-width={options.width}></div>
        </div>
      </div>
    );
  }
}
