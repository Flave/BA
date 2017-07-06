import React, { PropTypes } from 'react';
import LoadingItem from 'app/components/profile-feed/LoadingItem.jsx';

const callbacks = [];

function addScript(src, cb) {
  if (callbacks.length === 0) {
    callbacks.push(cb);
    var s = document.createElement('script');
    s.setAttribute('src', src);
    s.onload = () => callbacks.forEach(cb => cb());
    document.body.appendChild(s);
  } else {
    callbacks.push(cb);
  }
}

class TweetEmbed extends React.Component {
  componentDidMount() {
    const renderTweet = () => {
      window.twttr.ready().then(({ widgets }) => {
        const { item, options, onLoadSuccess, onLoadError } = this.props;

        if(!this.root) return;
        
        widgets.createTweetEmbed(item.id, this.root, options)
          .then((el) => {
            onLoadSuccess(el.clientHeight, item);
          })
          .catch(onLoadError);
      });
    };

    if (!window.twttr) {
      const isLocal = window.location.protocol.indexOf('file') >= 0;
      const protocol = isLocal ? this.props.protocol : '';

      addScript(`${protocol}//platform.twitter.com/widgets.js`, renderTweet);
    } else {
      renderTweet();
    }
  }

  render() {
    const { item, show } = this.props;
    let itemStyle = {
      top: item.y === null ? item.siblingTop : item.y,
      left: item.x
    }
    const containerStyle = {
      opacity: show ? 1 : 0
    }

    return (
      <div style={itemStyle} className="feed__item feed__item--twitter">
        {!show && <LoadingItem item={item} />}
        <div style={containerStyle} className="feed__item-container">
          <div ref={(root) => this.root = root}></div>
        </div>
      </div>
    );
  }
}

TweetEmbed.propTypes = {
  item: PropTypes.object,
  options: PropTypes.object,
  protocol: PropTypes.string,
  onLoadSuccess: PropTypes.func,
  onLoadError: PropTypes.func,
  className: PropTypes.string
};

TweetEmbed.defaultProps = {
  protocol: 'https:',
  options: {},
  className: null
};

export default TweetEmbed;
