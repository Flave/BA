import React, { Component } from 'react';

class Predictions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const modifiers = this.props.modifiers.map(modifier => `predictions--${modifier}`).join(" ");

    return (
      <div className={`chart`}>
        Line Chart
      </div>
    )
  }
}

export default Predictions;