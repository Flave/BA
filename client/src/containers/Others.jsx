import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import actions from '../actions';

class Others extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });

    //store.dispatch(actions.fetchAll());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    return (
      <div>
        <Link to="/">My Internet</Link>
        <h1>This is the Others page!!!</h1>
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default Others;