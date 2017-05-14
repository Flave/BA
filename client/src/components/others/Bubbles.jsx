import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _find from 'lodash/find';


class Bubbles extends Component {
  createUsersList() {
    const { users, user } = this.props;

    return users.map((bubbleUser, i) => {
      const age = _find(bubbleUser.predictions.demographics, {trait: "age"});
      return (
        <p key={i}>
          <Link to={`/someone/${bubbleUser.id}`}>{bubbleUser.id}</Link> is probably around {age && age.value} years old
        </p>
      )
    })
  }

  render() {
    return (
      <div className="bubbles">
        { this.createUsersList() }
      </div>
    )
  }
}

export default Bubbles;