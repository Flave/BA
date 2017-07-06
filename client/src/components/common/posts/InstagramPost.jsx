import React, { PropTypes } from 'react';
import InstagramEmbed from 'react-instagram-embed';
import LoadingItem from 'app/components/profile-feed/LoadingItem.jsx';

class InstagramPost extends React.Component {
  componentDidMount() {
  }

  handleOnAfterRender(item) {
    this.props.onLoadSuccess(this.root.clientHeight, this.props.item);
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
      <div style={itemStyle} className="feed__item feed__item--instagram">
        {!show && <LoadingItem item={item} />}
        <div ref={(root) => this.root = root} style={containerStyle} className="feed__item-container">
          <InstagramEmbed onAfterRender={this.handleOnAfterRender.bind(this)} url={item.id} width={options.width} maxWidth={options.width}/>
        </div>
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
