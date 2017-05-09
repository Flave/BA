import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as actions from '../actions';
import _find from 'lodash/find';

class Others extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });

    !store.users && store.dispatch(actions.fetchAll());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  createUsersList() {
    const { store } = this.context;
    const { users, user } = store.getState();

    if(!users) return;
    return users.map((bubbleUser, i) => {
      const age = _find(bubbleUser.predictions, {trait: "Age"});

      return (
        <p key={i}>
          <Link to={`/someone/${bubbleUser._id}`}>{bubbleUser._id}</Link> is probably around {age && age.value} years old
        </p>
      )
    })
  }

  render() {
    return (
      <div>
        <h1>This is the Others page!!!</h1>
        {this.createUsersList()}
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default Others;