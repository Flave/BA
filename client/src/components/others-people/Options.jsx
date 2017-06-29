import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from 'app/actions';
import _find from 'lodash/find';
import predictionGroups from 'root/constants/predictionGroups';
import predictions from 'root/constants/predictions';
import CheckGroup from 'app/components/common/CheckGroup.jsx';

import {
  withRouter,
  Route
} from 'react-router-dom';


class Others extends Component {
  handleOptionsChange(options) {
    this.context.store.dispatch(actions.setOthersPeopleOptions(options));
  }

  render() {
    const { store } = this.context;
    const { ui } = store.getState(); 

    return (
      <div className="drawer__content">
        <div className="drawer__section">
          {predictionGroups.map((group, i) => {
            // get all ticks that belong to this group
            const groupValues = group.properties.map((property) => {
              return _find(ui.othersPeopleOptions, {'id': property})
            });
            const groupOptions = group.properties.map((property) => {
              return _find(predictions, {'id': property})
            });

            return <CheckGroup 
              key={group.id}
              group={group}
              onChange={this.handleOptionsChange.bind(this)}
              values={groupValues}
              options={groupOptions}/>
          })}
        </div>
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Others);