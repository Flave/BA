import React, { Component } from 'react';

class Tooltip extends Component {
  componentDidMount() {
    let { position, offset } = this.props;
    let { root } = this;
    let width = root.clientWidth;
    let height = root.clientHeight;
    let top = position.y - height + offset.y;
    let className = "tooltip--top";

    if(top < 0) {
      top = top < 0 ? position.y - offset.y : top;
      className = "tooltip--bottom";
    }

    root.style.left = `${position.x}px`;
    root.style.top = `${top}px`;
    root.classList.add(className);
  }

  render() {
    const modifiers = this.props.modifiers.map(modifier => `tooltip--${modifier}`).join(" ");
    return  (
      <div className={`tooltip ${modifiers}`} ref={root => this.root = root}>
        {this.props.children}
      </div>
    )
  }
}

Tooltip.defaultProps = {
  modifiers: [],
  offset: {x: 0, y: -20}
}

export default Tooltip;