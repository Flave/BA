import React, { PropTypes } from 'react';

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
        widgets.createTweetEmbed(item.id, this.root, options)
          .then((el) => {
            onLoadSuccess(el.clientHeight, item.id);
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
    const { item, allLoaded } = this.props;
    let style = {
      top: item.y,
      left: item.x,
      opacity: allLoaded ? 1 : 0
    }

    return (
      <div style={style} ref={(root) => this.root = root} className="feed__item feed__item--twitter"></div>
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
