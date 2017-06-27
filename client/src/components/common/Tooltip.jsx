import React, { Component } from 'react';

class Tooltip extends Component {
  componentDidMount() {
    let { position } = this.props;
    let { root } = this;
    let width = root.clientWidth;
    let height = root.clientHeight;

    root.style.left = `${position.x}px`;
    root.style.top = `${position.y - height - 20}px`;
  }

  render() {
    const modifiers = this.props.modifiers.map(modifier => `tooltip--${modifier}`)
    return  (
      <div className={`tooltip ${modifiers.join(" ")}`} ref={root => this.root = root}>
        {this.props.children}
      </div>
    )
  }
}

Tooltip.defaultProps = {
  modifiers: []
}

export default Tooltip;