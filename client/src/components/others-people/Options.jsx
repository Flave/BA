import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from 'app/actions';
import _find from 'lodash/find';
import _compact from 'lodash/compact';
import predictionGroups from 'root/constants/predictionGroups';
import predictionOptions from 'root/constants/predictionOptions';
import predictions from 'root/constants/predictions';
import CheckGroup from 'app/components/common/Check.jsx';

import {
  withRouter,
  Route
} from 'react-router-dom';


class Others extends Component {
  handleOptionsChange(group, value) {
    const options = group.properties.map((id) => {
      return { id, value: value }
    });

    this.context.store.dispatch(actions.setOthersPeopleOptions(options));
  }

  createChecks() {
    const { store } = this.context;
    const { ui } = store.getState();

    return (
      <div className="drawer__section">
        {predictionOptions.map((group, i) => {
          const options = ui.othersPeopleOptions.filter(option => 
            (group.properties.indexOf(option.id) !== -1) && option.value
          )

          return <CheckGroup
            key={group.id}
            option={group}
            value={options.length}
            color={group.color(1) + ""}
            onChange={this.handleOptionsChange.bind(this)}/>
        })}
      </div>
    )
  }

  render() {
    return (
      <div className="drawer__content">
        {this.createChecks()}
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Others);