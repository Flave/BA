import React, { PropTypes } from 'react';
import InstagramEmbed from 'react-instagram-embed';

class InstagramPost extends React.Component {
  componentDidMount() {
  }

  handleSuccess(item) {
    this.props.onLoadSuccess(this.root.clientHeight, this.props.item.id);
  }

  render() {
    const { item, allLoaded, options } = this.props;
    let style = {
      top: item.y,
      left: item.x,
      opacity: allLoaded ? 1 : 0
    }

    return (
      <div style={style} ref={(root) => this.root = root} className="feed__item feed__item--instagram">
        <InstagramEmbed onSuccess={this.handleSuccess.bind(this)} url={item.id} maxWidth={options.width}/>
      </div>
    );
  }
}

InstagramPost.propTypes = {
  item: PropTypes.object,
  options: PropTypes.object,
  protocol: PropTypes.string,
  onLoadSuccess: PropTypes.func,
  onLoadError: PropTypes.func,
  className: PropTypes.string
};

InstagramPost.defaultProps = {
  protocol: 'https:',
  options: {},
  className: null
};

export default InstagramPost;
